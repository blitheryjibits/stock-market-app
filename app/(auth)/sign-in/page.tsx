'use client'
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import FooterLink from '@/components/forms/FooterLink'

const Signin = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit: SubmitHandler<SignInFormData> = async (data: SignInFormData) => {
        try {
            console.log('Sign in data:', data);
        } catch (error) {
            console.error("Error submitting sign-in form:", error);
        }
    };

    return (
        <>
            <h1 className="form-title">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField 
                    name="email"
                    label="Email"
                    placeholder="john@example.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email is required", pattern: { value: /^\w+@\w+\.\w+$/, message: "Invalid email address" } }}
                />

                <InputField 
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type={"password"}
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password is required", minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Sign up" href="/sign-up" />
            </form>
        </>
    );

}
export default Signin;