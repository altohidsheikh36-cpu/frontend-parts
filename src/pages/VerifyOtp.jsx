import { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerifyOtp() {
  return (
    <div className="cro-page-narrow">
      <div className="w-full max-w-md">
        <div className="cro-card text-center">
          <h1 className="cro-h1">Verification disabled</h1>
          <p className="cro-lead mt-4">We've removed OTP/email/SMS verification. You can sign in directly after registering.</p>
          <div className="mt-6">
            <Link to="/login" className="cro-btn-primary">
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
