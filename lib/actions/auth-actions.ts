'use server'

import { auth } from '@/lib/better-auth/auth'
import { inngest } from '@/lib/inngest/client';

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData) => {

    try {
        const response = await auth.api.signUpEmail({
            body: { email: email, password: password, name: fullName },
        });

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry,
                }
            })
        }

        return {success: true, data: response};

    } catch (e) {
        console.error('signup error:', e);
        return { success: false, error: 'Signup failed' };
    }
}