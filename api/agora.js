export default function handler(req, res) {
  res.status(200).json({ appId: process.env.AGORA_APP_ID });
}