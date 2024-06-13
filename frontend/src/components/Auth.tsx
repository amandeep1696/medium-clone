import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignupInput } from '@amansin97/medium-common';
import axios from 'axios';
import { BACKEND_URL } from '../config';

// Todo fix width of input boxes
// Todo Need separate components for signup and signin. With reusable things like Authheader component etc

export const Auth = ({ type }: { type: 'signup' | 'signin' }) => {
  const navigate = useNavigate();

  const [postInputs, setPostInputs] = useState<SignupInput>({
    email: '',
    password: '',
    name: '',
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === 'signup' ? 'signup' : 'signin'}`,
        postInputs
      );
      const jwt = response.data.jwt; // todo harkirat didn't do .jwt though. log response once and see what response.data gives
      localStorage.setItem('token', jwt); // todo check if it should be Bearer space
      navigate('/blogs');
    } catch (e) {
      console.log(e);
      // todo perhaps based on error types you can show alert boxes on UI. there are alert libraries available
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold text-center">
              {type === 'signup'
                ? 'Create an account'
                : 'Login to your account'}{' '}
            </div>
            <div className="text-slate-500 text-center">
              {type === 'signup'
                ? 'Already have an account?'
                : "Don't have an account?"}
              <Link
                className="pl-2 underline"
                to={type === 'signup' ? '/signin' : '/signup'}
              >
                {type === 'signup' ? 'Login' : 'Sign up'}
              </Link>{' '}
            </div>
          </div>
          <div className="pt-4">
            {type === 'signup' ? (
              <LabelledInput
                label={'Name'}
                placeholder={'Enter your name'}
                onChange={(e) => {
                  setPostInputs((postInputs) => {
                    return { ...postInputs, name: e.target.value };
                  });
                }}
              ></LabelledInput>
            ) : null}

            <LabelledInput
              label={'Email'}
              placeholder={'m@example.com'}
              onChange={(e) => {
                setPostInputs((postInputs) => {
                  return { ...postInputs, email: e.target.value };
                });
              }}
            ></LabelledInput>
            <LabelledInput
              label={'Password'}
              placeholder={''}
              onChange={(e) => {
                setPostInputs((postInputs) => {
                  return { ...postInputs, password: e.target.value };
                });
              }}
              type="password"
            ></LabelledInput>
            <button
              onClick={sendRequest}
              type="button"
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-black pt-4">
        {label}
      </label>
      <input
        type={type || 'text'}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
        required
      />
    </div>
  );
}
