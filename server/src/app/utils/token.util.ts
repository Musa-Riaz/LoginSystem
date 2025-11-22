import jwt, { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');


export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  //change according to backend
  role: 'user' | 'admin';

}

//issue a jwt token
export function issueToken(payload: TokenPayload, expiresIn: string | number = '1h'): string {
    const options: SignOptions = { expiresIn: expiresIn as unknown as SignOptions['expiresIn'] };
    return jwt.sign(payload as JwtPayload, JWT_SECRET, options);
}

//verifying access token
export function verifyToken(token: string, ) : TokenPayload  {
  try{

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded; 

  }
  catch(err){
    console.log("Token verification error", err);
    throw new Error('Invalid token'); 
  }
}


//extracting the token from the authorization header
export function extractToken(authHeader: string | undefined) : string | undefined{
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return undefined;
  }
  return authHeader.split(" ")[1] ;
}
