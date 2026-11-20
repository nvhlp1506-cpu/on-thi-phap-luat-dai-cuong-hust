import { getStore } from "@netlify/blobs";

function getClientIp(req, context) {
  if (context && context.ip) return String(context.ip).trim();
  const nfIp = req.headers.get("x-nf-client-connection-ip");
  if (nfIp) return nfIp.trim();
  const clientIp = req.headers.get("client-ip");
  if (clientIp) return clientIp.trim();
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0].trim();
    if (first) return first;
  }
  return "127.0.0.1";
}

function maskIp(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return "Máy Cục Bộ";
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts[0]}:${parts[1] || ''}:*:*`;
  }
  return ip.slice(0, 8) + "***";
}

export default async (req, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const fakeNames = ["Nguyễn Minh Trí", "Trần Thu Hà", "Lê Quốc Bảo", "Hoàng Anh Tuấn", "Đặng Thùy Dung", "Kiểm Thử IP HUST"];
  function isFilteredName(n) {
    if (!n) return true;
    const str = String(n).trim();
    if (fakeNames.includes(str)) return true;
    if (str.toLowerCase().includes("kiểm thử") || str.toLowerCase().includes("test ip")) return true;
    return false;
  }
  const clientIp = getClientIp(req, context);
  const ipMasked = maskIp(clientIp);

  try {
    const store = getStore("hust-arena-scores");

    if (req.method === "GET") {
      let scores = await store.get("leaderboard", { type: "json" });
      if (!Array.isArray(scores)) {
        scores = [];
      }
      // Strictly accept and show only real users; eliminate mock data & legacy pvp records
      scores = scores.filter(s => s && s.id && !s.id.startsWith("lead_") && !isFilteredName(s.name) && s.mode !== "pvp");

      let ipRegistry = await store.get("ip_registry", { type: "json" });
      if (!ipRegistry || typeof ipRegistry !== "object") {
        ipRegistry = {};
      }

      let myIpStats = ipRegistry[clientIp] || null;
      if (myIpStats && isFilteredName(myIpStats.lastName)) {
        myIpStats = null;
      }

      return new Response(JSON.stringify({
        clientIp: ipMasked,
        clientIpFull: clientIp,
        myIpStats: myIpStats,
        leaderboard: scores
      }), { headers: corsHeaders });
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (!body || !body.name || body.score === undefined) {
        return new Response(JSON.stringify({ error: "Thiếu thông tin người chơi hoặc điểm số" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const trimmedName = String(body.name).trim();
      const trimmedClass = String(body.className || "").trim();
      const scoreVal = Math.max(0, Number(body.score) || 0);
      const deviceId = String(body.deviceId || "dev_guest").slice(0, 50);

      if (isFilteredName(trimmedName)) {
        return new Response(JSON.stringify({ error: "Không chấp nhận dữ liệu mẫu tự tạo" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      let scores = await store.get("leaderboard", { type: "json" });
      if (!Array.isArray(scores)) {
        scores = [];
      }
      scores = scores.filter(s => s && s.id && !s.id.startsWith("lead_") && !isFilteredName(s.name) && s.mode !== "pvp");

      let ipRegistry = await store.get("ip_registry", { type: "json" });
      if (!ipRegistry || typeof ipRegistry !== "object") {
        ipRegistry = {};
      }

      const nowIso = new Date().toISOString();
      const nowDateStr = new Date().toLocaleDateString("vi-VN");

      // 1. Cập nhật hồ sơ lưu trữ riêng của IP máy này
      if (!ipRegistry[clientIp]) {
        ipRegistry[clientIp] = {
          ip: clientIp,
          ipMasked: ipMasked,
          firstJoined: nowIso,
          lastActive: nowIso,
          totalRuns: 1,
          bestScore: scoreVal,
          bestStage: Number(body.stageReached) || 1,
          bestCombo: Number(body.maxCombo) || 0,
          bestAccuracy: String(body.accuracy || "100%"),
          lastName: trimmedName,
          lastClass: trimmedClass,
          deviceId: deviceId
        };
      } else {
        const item = ipRegistry[clientIp];
        item.lastActive = nowIso;
        item.totalRuns = (item.totalRuns || 0) + 1;
        item.lastName = trimmedName;
        item.lastClass = trimmedClass;
        item.deviceId = deviceId;
        if (scoreVal > (item.bestScore || 0)) {
          item.bestScore = scoreVal;
          item.bestStage = Number(body.stageReached) || 1;
          item.bestCombo = Number(body.maxCombo) || 0;
          item.bestAccuracy = String(body.accuracy || "100%");
        }
      }

      const newRecord = {
        id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        name: trimmedName.slice(0, 30),
        className: trimmedClass.slice(0, 30),
        heroId: String(body.heroId || "bachkhoa"),
        heroName: String(body.heroName || "Học Thần HUST"),
        heroAvatar: String(body.heroAvatar || "assets/avatars/bachkhoa.jpg"),
        mode: "campaign",
        modeName: "Vượt Ải",
        stageReached: Number(body.stageReached) || 1,
        stageName: String(body.stageName || "Vượt Ải"),
        score: scoreVal,
        maxCombo: Number(body.maxCombo) || 0,
        correctCount: Number(body.correctCount) || 0,
        accuracy: String(body.accuracy || "100%"),
        ip: clientIp,
        ipMasked: ipMasked,
        deviceId: deviceId,
        date: nowDateStr,
        updatedAt: nowIso
      };

      // 2. Tìm kiếm kỷ lục cũ của cùng người chơi / IP máy
      const existingIdx = scores.findIndex(s => {
        if (!s) return false;
        const sameDevice = s.deviceId && deviceId !== "dev_guest" && s.deviceId === deviceId;
        const sameIpAndName = s.ip && s.ip === clientIp && s.name && s.name.toLowerCase() === trimmedName.toLowerCase();
        const sameNameAndClass = s.name && s.name.toLowerCase() === trimmedName.toLowerCase() &&
          String(s.className || '').trim().toLowerCase() === trimmedClass.toLowerCase();
        return sameDevice || sameIpAndName || sameNameAndClass;
      });

      let syncMessage = "";
      let isHigher = false;

      if (existingIdx !== -1) {
        const existing = scores[existingIdx];
        if (newRecord.score > existing.score) {
          // Điểm mới CAO HƠN -> Đồng bộ dữ liệu mới, giữ nguyên id gốc
          isHigher = true;
          const diff = newRecord.score - existing.score;
          newRecord.id = existing.id;
          scores[existingIdx] = newRecord;
          syncMessage = `Đồng bộ thành công! Kỷ lục mới cao hơn (+${diff.toLocaleString()} PTS) đã được cập nhật cho IP máy của bạn!`;
        } else {
          // Điểm mới THẤP HƠN hoặc BẰNG -> Bảo lưu thành tích cao nhất
          await store.setJSON("ip_registry", ipRegistry);
          return new Response(JSON.stringify({
            success: true,
            isHigher: false,
            synced: false,
            message: `Kỷ lục trước đó (${existing.score.toLocaleString()} PTS) cao hơn điểm số này (${newRecord.score.toLocaleString()} PTS). Hệ thống bảo lưu kết quả cao nhất!`,
            record: existing,
            myIpStats: ipRegistry[clientIp]
          }), { headers: corsHeaders });
        }
      } else {
        // Lần đầu ghi danh của IP máy này
        isHigher = true;
        scores.push(newRecord);
        syncMessage = `Đã ghi nhận kỷ lục đầu tiên của IP máy này: ${newRecord.score.toLocaleString()} PTS!`;
      }

      scores.sort((a, b) => b.score - a.score);
      if (scores.length > 500) {
        scores = scores.slice(0, 500);
      }

      await store.setJSON("leaderboard", scores);
      await store.setJSON("ip_registry", ipRegistry);

      return new Response(JSON.stringify({
        success: true,
        isHigher: isHigher,
        synced: true,
        message: syncMessage,
        record: newRecord,
        myIpStats: ipRegistry[clientIp]
      }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Thao tác không được phép. Dữ liệu Bảng Xếp Hạng là bất biến và không thể xóa bỏ!" }), { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({
      clientIp: ipMasked,
      clientIpFull: clientIp,
      myIpStats: null,
      leaderboard: []
    }), { headers: corsHeaders, status: 200 });
  }
};
