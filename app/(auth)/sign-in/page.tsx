// React arrow function component export (rafce)
import AuthForm from "@/components/AuthForm";

// NOTE: NO {} in component declaration == immediate return of something >> e.g., another component
const SignIn = () => <AuthForm type="sign-in" />;

export default SignIn;
