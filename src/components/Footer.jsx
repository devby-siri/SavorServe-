import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#2B2118] text-[#FFF8F0] pt-12 pb-8 border-t-4 border-[#D4A24C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#D4A24C] mb-2">SavorServe</h3>
          <p className="text-sm text-[#756B63] italic mb-4">"Your cravings. Our service. Just chat and order."</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            College Computer Science & Engineering Capstone Demo Project.
            Built with React, Tailwind CSS, & AI Natural Language Engine.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4A24C] mb-3">Opening Hours</h4>
          <ul className="text-xs text-gray-300 space-y-2">
            <li className="flex justify-between"><span>Monday - Friday:</span> <span>10:00 AM - 10:30 PM</span></li>
            <li className="flex justify-between"><span>Saturday - Sunday:</span> <span>11:00 AM - 11:00 PM</span></li>
            <li className="text-[#D4A24C] font-semibold mt-2">Chatbot Online 24/7 for Orders</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4A24C] mb-3">Restaurant Address</h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            123 Gourmet Avenue, Foodie District<br />
            Bengaluru, Karnataka — 560001
          </p>
          <p className="text-xs text-gray-300">📞 Contact: +91 98765 43210</p>
          <p className="text-xs text-gray-300">✉️ Support: orders@savorserve.com</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-400">
        © 2026 SavorServe. All Rights Reserved. Student CSE Project.
      </div>
    </footer>
  );
}