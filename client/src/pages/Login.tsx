import { Link, useNavigate } from "react-router-dom";
import Button from '../ui/Button'
import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginSchema } from "../validation/auth";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../slices/redux-slices/user-api";
import type { RootState } from "../store";
import { toast } from "react-toastify";
import { setUserInfo } from "../slices/redux-slices/auth";
import { useEffect } from "react";
import GoogleButton from "../components/SocialLogin";

type FormInputs = z.infer<typeof loginSchema>

const LoginPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormInputs>({ resolver: zodResolver(loginSchema) })

    const [login, { isLoading }] = useLoginMutation()
    const userInfo = useSelector((state: RootState) => state.auth.userInfo)

    const submit: SubmitHandler<FormInputs> = async (data) => {
        try {
            const res = await login(data).unwrap();

            dispatch(setUserInfo(res.data));
            reset();
            toast.success("Login successfully");

        } catch (err: any) {
            toast.error(err?.data?.message || err.message);
        }
    };

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === "ADMIN") {
                navigate('/admin')
                return
            }
            if (userInfo.requiresPhone) {
                navigate("/add-phone");
                return;
            }

            navigate('/home');
        }
    }, [navigate, userInfo])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to Your Account
                </h2>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">

                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                    />
                    {errors.email && (
                        <span className="text-red-400 text-sm font-medium">{errors.email.message}</span>
                    )}

                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        {...register('password')}
                    />
                    {errors.password && (
                        <span className="text-red-400 text-sm font-medium">{errors.password.message}</span>
                    )}

                    <Button className="w-full justify-center" disabled={isSubmitting || isLoading}>
                        {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
                    </Button>

                </form>

                <div className="my-4 flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                <GoogleButton />

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold hover:underline">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default LoginPage