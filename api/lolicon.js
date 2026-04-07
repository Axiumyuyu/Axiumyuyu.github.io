// api/lolicon.js
export default async function handler(req, res) {
  // 1. 设置跨域头，允许你的任意前端页面调用这个 Vercel 接口
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 强制获取 regular 和 original，并要求返回官方域名 proxy=i.pximg.net
    const targetUrl = "https://api.lolicon.app/setu/v2?size=regular&size=original&proxy=i.pximg.net";
    
    // 2. 伪装成真实的 PC 浏览器去请求 API
    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!fetchRes.ok) {
       throw new Error(`Lolicon API returned status: ${fetchRes.status}`);
    }

    const data = await fetchRes.json();
    
    // 3. 将拿到的数据原封不动地返回给前端
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}