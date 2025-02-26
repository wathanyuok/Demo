// server/middlewares/error.js
const handleErrors = (err, req, res, next) => {
  console.error(err.stack)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' })
  }

  res.status(500).json({ error: 'เกิดข้อผิดพลาดบางอย่าง' })
}

export default handleErrors