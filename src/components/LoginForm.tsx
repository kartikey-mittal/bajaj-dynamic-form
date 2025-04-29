import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../types/form';
import { createUser } from '../services/api';
import { UserCircle2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserData>({
    rollNumber: '',
    name: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUser(formData);
      localStorage.setItem('rollNumber', formData.rollNumber);
      localStorage.setItem('userName', formData.name);
      navigate('/form');
    } catch (err) {
      // console.log(err);
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
    
      <div className="w-3/5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col justify-between p-12">
     
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-5xl font-extrabold tracking-wide text-center">
            Dynamic Form
          </h1>
        </div>

        
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">Kartikey Mittal</p>
          <p className="text-md">km7563@srmist.edu.in</p>
          <a 
            href="https://github.com/kartikey-mittal/bajaj-dynamic-form" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline text-md hover:text-gray-300 transition"
          >
            GitHub Profile
          </a>
          <p className="text-md">SRM NCR</p>
        </div>
      </div>

    
      <div className="w-2/5 flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <UserCircle2 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Student Login</h2>
            <p className="text-gray-600 mt-2">Enter your details to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={formData.rollNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
