import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import * as z from 'zod'
import { registerSchema } from "../validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRegisterMutation } from "../slices/redux-slices/user-api";
import { toast } from "react-toastify";
import GoogleButton from "../components/SocialLogin";

type formInputs = z.infer<typeof registerSchema>

const RegisterPage = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<formInputs>({
        resolver: zodResolver(registerSchema)
    })

    const [registerMutation, { isLoading }] = useRegisterMutation()

    const navigate = useNavigate()

    const submit: SubmitHandler<formInputs> = async (data) => {
        try {
            await registerMutation(data).unwrap()
            reset()
            toast.success('Registration successful')
            navigate('/login')
        } catch (err: any) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">

                    <FormInput
                        label="First Name"
                        type="text"
                        placeholder="John"
                        {...register('firstName')}
                    />
                    {errors.firstName && <span className="text-red-400 text-sm font-medium">{errors.firstName.message}</span>}


                    <FormInput
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        {...register('lastName')}
                    />
                    {errors.lastName && <span className="text-red-400 text-sm font-medium">{errors.lastName.message}</span>}


                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                    />
                    {errors.email && <span className="text-red-400 text-sm font-medium">{errors.email.message}</span>}


                    <PasswordInput
                        label="Password"
                        placeholder="Create a password"
                        {...register('password')}
                    />
                    {errors.password && <span className="text-red-400 text-sm font-medium">{errors.password.message}</span>}


                    <FormInput
                        label="Phone"
                        type="text"
                        placeholder="Enter your phone"
                        {...register('phone')}
                    />
                    {errors.phone && <span className="text-red-400 text-sm font-medium">{errors.phone.message}</span>}


                    <Button className="w-full justify-center" disabled={isSubmitting || isLoading}>
                        {isSubmitting || isLoading ? 'Registering...' : 'Register'}
                    </Button>

                </form>

                <div className="my-4 flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                <GoogleButton />

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default RegisterPage