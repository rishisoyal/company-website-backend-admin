import bcrypt from "bcrypt";

export async function generateHash(pass: string) {
  const saltRound = 10;
  try {
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// console.log(await generateHash('admin'));

