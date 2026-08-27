import React from 'react';

const SAMPLES = [
  {
    id: 1,
    title: "1. Bank Phishing",
    text: "URGENT: Your HDFC bank account has been blocked due to missing KYC updates. Update now at http://hdfc-bank-verify-kyc.net or account will be permanently closed."
  },
  {
    id: 2,
    title: "2. Lottery / Prize Scam",
    text: "Congratulations! You have won ₹50,000 in Tata Lucky Draw. Claim your prize immediately by clicking https://tata-win-prize.claim-now.top"
  },
  {
    id: 3,
    title: "3. Fake Job Offer",
    text: "You've been selected for a remote Work From Home job earning ₹8,000 per day! No experience needed. Deposit ₹500 registration fee to activate."
  },
  {
    id: 4,
    title: "4. Normal Conversation",
    text: "Hey, can you please send me the project report slide deck when you get a chance? Thanks!"
  },
  {
    id: 5,
    title: "5. Delivery Scam",
    text: "Your Amazon package delivery #88392 is suspended due to unpaid shipping fee of ₹49. Pay immediately at http://pkg-track-express.info/pay"
  },
  {
    id: 6,
    title: "6. OTP / Password Scam",
    text: "Dear SBI customer, your YONO access has expired. Please share your OTP 884920 to unblock your account immediately."
  }
];

const SampleLoader = ({ onSelectSample }) => {
  return (
    <div className="sample-section">
      <div className="sample-title">Demonstration Sample Messages:</div>
      <div className="sample-pills">
        {SAMPLES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            className="sample-pill"
            onClick={() => onSelectSample(sample.text)}
          >
            {sample.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleLoader;
