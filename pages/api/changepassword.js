import connectMongo from "../../database/conn"
import Users from "../../model/Schema";
import { hash } from "bcryptjs";

export default async function ChangePassword(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed" }));

  const { newpassword, confirmpassword, cpassword, email } = req.body;

  //post method is the only thing that is accepted

  if (req.method == "POST") {
    if (!req.body)
      return res.status(404).json({ error: "Don't have form data" });

    const user = await Users.findOne(session.user.email);
    if (user) {
      const filter = { email: email };
      const update = { password: hash(newpassword, 12) };
      await Users.findOneAndUpdate(filter, update);
      res.status(201).json({ status: true, user: data });
    }
  } else {
    res.status(500).json({ error: "Something's not right here" });
  }
}
