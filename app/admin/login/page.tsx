'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error){ 
            setError('Неверный email или пароль');
            return;
        }
        router.push('/admin');
    }
    return (
        <div className="mx-auto max-w-sm px-6 py-20">
            <h1 className="mb-6 text-xl font-semibold">Вход в админку</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded border p-2"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded border p-2"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="w-full rounded bg-black py-2 text-white">
                    Войти
                </button>
            </form>
        </div>
    );
}