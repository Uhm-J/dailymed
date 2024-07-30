import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (code) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store the token in localStorage or a secure cookie
        res.setHeader('Set-Cookie', `token=${data.token}; HttpOnly; Path=/; Max-Age=86400`)
        res.redirect('/')
      } else {
        res.status(400).json({ error: 'Authentication failed' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  } else {
    res.status(400).json({ error: 'No code provided' })
  }
}