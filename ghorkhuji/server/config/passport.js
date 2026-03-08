import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || "";
          const avatar = profile.photos?.[0]?.value || "";
          const name = profile.displayName || "Google User";

          let user = await User.findOne({ googleId: profile.id });

          if (!user && email) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name,
              email,
              googleId: profile.id,
              provider: "google",
              avatar,
            });
          } else {
            if (!user.googleId) user.googleId = profile.id;
            if (!user.email && email) user.email = email;
            user.provider = "google";
            if (!user.avatar && avatar) user.avatar = avatar;

            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;