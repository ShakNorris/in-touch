import connectMongo from "../../database/conn";
import Users from "../../model/Schema";
import { hash } from "bcryptjs";

export default async function ChangePassword(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed" }));

  const bcrypt = require('bcryptjs');

  const { currentpassword, newpassword, cpassword, email } = req.body;

  //post method is the only thing that is accepted

  if (req.method == "POST") {
    if (!req.body)
      return res.status(404).json({ error: "There's no data in the form..." });

    const user = await Users.findOne({ email });
    const isMatch = await bcrypt.compare(currentpassword, user.password);
    if (user && isMatch) {
      const filter = { email: email };
      const update = { password: await hash(newpassword, 12) };
      await Users.findOneAndUpdate(filter, update);
      res.status(201).json({ status: true, user: data });
    } else {
      return res
        .status(404)
        .json({ error: "Password change wasn't successful." });
    }
  } else {
    res.status(500).json({ error: "Something's not right here" });
  }
}
