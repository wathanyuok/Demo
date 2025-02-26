const prisma = require("../configs/prisma");


exports.listUsers = async (req, res, next) => {

  try {
    const users = await prisma.profile.findMany({
      omit: {
        password: true,
      },
    });
    res.json({ result: users });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    console.log(id, role);
  
    const updated = await prisma.profile.update({
      where: { id: Number(id) },
      data: { role: role },
    });

    res.json({ message: "Update Success" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(id);
    res.json({ message: "Delete Success" });
  } catch (error) {
    next(error);
  }
};