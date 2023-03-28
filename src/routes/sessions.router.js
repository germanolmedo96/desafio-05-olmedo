import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/user.js";
// import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.post(
    '/register',
    passport.authenticate("register", {failureRedirect: "failregister"}),
    async (req, res) => {
      return res.send({status: "success", message: "User registered"});
    }
  );

router.get('/failregister', async (req, res) => {
    console.log("Fallo la estrategia");
    res.send({ status: 500, error: "Fallo registro" })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
        req.session.user = {
            id: "adminCoder",
            first_name: "Coder",
            last_name: "Admin",
            email: email,
            rol: "admin",
        };
        return res.send({ status: "success", message: "logueado" });
    }

    if (!req.user) return res.status(400).send({ status: "error", error: "Contraseña invalida" });


    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }
    res.send({ status: "success", payload:req.user });
})

router.get('/faillogin', async (req, res) => {
    console.log("Fallo la estrategia");
    res.status(500).send({ error: "Failed" })
})

router.get('/github',passport.authenticate('github',{scope:['user:email']},async(req,res)=>{}))

router.get('/githubcallback',passport.authenticate('github', {failureRedirect:'/login'}),async(req,res)=>{
    req.session.user =req.user,
    res.redirect('/');
})

export default router;