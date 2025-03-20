import { db } from "../db";
import { users, type NewUser, type UserRole } from "../db/schema/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Browser-compatible UUID generation function
const generateUUID = () => {
  // Use browser's crypto.getRandomValues for secure random generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = window.crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Use a simple token generation approach for the browser
const generateToken = (payload: any) => {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // In a real app, you would use a secure secret key
  const signature = btoa(`${encodedHeader}.${encodedPayload}`);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    // Create new user
    const newUser: NewUser = {
      id: generateUUID(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
    };
    
    const [createdUser] = await db.insert(users).values(newUser).returning();
    
    // Generate token
    const token = generateToken({ id: createdUser.id, role: createdUser.role, email: createdUser.email, name: createdUser.name });
    
    return { user: createdUser, token };
  },
  
  async signIn(data: SignInData) {
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, data.email));
    
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(data.password, user.password);
    
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    
    // Generate token
    const token = generateToken({ id: user.id, role: user.role, email: user.email, name: user.name });
    
    return { user, token };
  },
  
  verifyToken(token: string) {
    try {
      const [encodedHeader, encodedPayload] = token.split('.');
      
      if (!encodedHeader || !encodedPayload) {
        return null;
      }
      
      const payload = JSON.parse(atob(encodedPayload));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};
