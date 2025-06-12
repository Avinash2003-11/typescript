import bcrypt from 'bcrypt'
import { stringify } from 'querystring';

export const hash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
;
}
export const compare = async (inputpassword: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(inputpassword, hash)
};