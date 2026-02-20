import { Router, Request, Response } from "express";

export const authRouter = Router();

interface MockUser {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  accountNumber: string;
  status: "pending" | "approved";
}

// In-memory mock store
const MOCK_USERS: MockUser[] = [
  {
    username: "jachemlyn",
    password: "H@rlz@2836",
    fullName: "Jachemlyn",
    email: "jachemlyn@chinabank.ph",
    phone: "9120000001",
    accountNumber: "1234-5678-9012",
    status: "approved",
  },
];

authRouter.post("/auth/register", (req: Request, res: Response) => {
  const { fullName, email, phone, password, confirmPassword, agreedToTerms } =
    req.body;

  if (!fullName || !email || !phone || !password || !confirmPassword) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match." });
    return;
  }

  if (!agreedToTerms) {
    res
      .status(400)
      .json({ message: "You must agree to the Terms and Conditions." });
    return;
  }

  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) {
    res
      .status(409)
      .json({ message: "An account with this email already exists." });
    return;
  }

  const newUser: MockUser = {
    username: email,
    password,
    fullName,
    email,
    phone,
    accountNumber: "PENDING",
    status: "pending",
  };

  MOCK_USERS.push(newUser);

  res.status(201).json({
    message:
      "Your account has been registered. Please wait 3-5 business days for approval.",
  });
});

authRouter.post("/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  const user = MOCK_USERS.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  if (!user) {
    res.status(401).json({ message: "Invalid username or password." });
    return;
  }

  if (user.status !== "approved") {
    res.status(403).json({
      message:
        "Your account is pending approval. Please wait 3-5 business days.",
    });
    return;
  }

  const token = Buffer.from(`${user.username}:${Date.now()}`).toString(
    "base64"
  );

  res.json({
    token,
    user: {
      username: user.username,
      fullName: user.fullName,
      accountNumber: user.accountNumber,
    },
  });
});
