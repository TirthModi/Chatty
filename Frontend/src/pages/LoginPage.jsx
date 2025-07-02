import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern.jsx';

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLoggingIn} = useAuthStore();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className = "min-h-screen grid lg:grid-cols-2"> 
            {/* Left Side - Background Image */}
            <div className="flex flex-col  items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className = "text-center mb-8">
                        <div className = "flex flex-col items-center gap-2 group">
                            <div className = "size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className = "text-base-content/60">
                                Sign in to your account</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit = {handleSubmit} className="space-y-6">

                        <div className = "form-control">
                            <label className="label">
                                <span className="label-text font-medium">Mail</span>
                            </label>
                            <div className = "relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`input input-bordered w-full pl-10`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className = "form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className = "relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className={"input input-bordered w-full pl-10"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40"/>
                                    ) : (
                                        <Eye className="size-5 text-base-content/40"/>
                                    )}
                                </button>
                            </div>
                        </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading...
                                </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don't have an account? 
                            <a href="/signup" className="text-primary font-medium hover:underline"> Create Account</a>    
                        </p>
                    </div>
                </div>
            </div>
                {/* Right Side - Background Image */}
                <AuthImagePattern 
                    title="Join your community"
                    subtitle="Connect with friends, share moments, and stay in touch with our loved ones."
                />
         </div>
    )
}
export default LoginPage;