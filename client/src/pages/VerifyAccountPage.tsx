import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLoading, useToast } from '@/hooks';
import { verifyAccount } from '@/services/auth';
import { routes } from '@/router/routeConfig';

export const VerifyAccountPage: React.FC = () => {
  // Grab the verification token from the URL query params
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('verificationToken');
  const { setLoading, isLoading } = useLoading();

  const toast = useToast();
  const navigate = useNavigate();

  // Mutation to call the verification endpoint
  const mutation = useMutation({
    mutationFn: () => {
      setLoading(true);
      return verifyAccount(verificationToken!);
    },
    onSuccess: () => {
      setLoading(false);
      toast.success('Account verified successfully!');
      navigate(routes.login, { replace: true });
    },
    onError: () => {
      setLoading(false);
      toast.error('Verification failed');
    },
  });

  // If there's no token in the URL, show an invalid message
  if (!verificationToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Invalid Verification Link</h1>
        <p className="text-gray-600">No verification code provided in the URL.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Verify Your Account</h1>
      <p className="mb-6 text-gray-700">
        Click the button below to verify your account using the token:
      </p>
      <code className="block mb-6 bg-gray-100 p-2 rounded">{verificationToken}</code>
      <Button
        onClick={() => mutation.mutate()}
        disabled={isLoading}
        className="w-full max-w-xs"
      >
        {isLoading ? 'Verifying...' : 'Verify Account'}
      </Button>
      {mutation.isError && (
        <p className="mt-4 text-red-600">{(mutation.error as Error).message}</p>
      )}
    </div>
  );
};
