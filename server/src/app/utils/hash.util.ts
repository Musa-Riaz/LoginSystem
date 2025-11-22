
import bcrypt from 'bcryptjs'
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

// hashing password

export async function hashPassword(password : string){
 return  await bcrypt.hash(password, SALT_ROUNDS);

}

//comparing and returing password

export async function comparePassword(password: string, hash: string){
    return await bcrypt.compare(password, hash);
}