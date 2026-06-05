"use client";

import React, { useState, useRef, useEffect } from 'react';

const WorkforceCTAForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    hqLocation: '',
    services: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sanitizeName = (value: string) => value.replace(/[^A-Za-z\s]/g, '');
  const sanitizeOrganization = (value: string) => value.replace(/[^A-Za-z0-9\s]/g, '');
  const sanitizePhone = (value: string) => value.replace(/\D/g, '').slice(0, 10);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load Cloudflare Turnstile script and render widget
  // Render Turnstile widget (re-usable)
  const renderTurnstile = () => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) return;
    try {
      const win = window as any;
      if (win.turnstile && captchaRef.current) {
        // If widget already exists, attempt to reset it instead of re-rendering
        try {
          if (widgetIdRef.current != null) {
            win.turnstile.reset(widgetIdRef.current);
            return;
          }
        } catch (e) {
          // ignore
        }

        widgetIdRef.current = win.turnstile.render(captchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken(null),
        });
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // ensure the script is loaded and render when available
    if ((window as any).turnstile) {
      renderTurnstile();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    document.head.appendChild(script);

    return () => {
      // keep script for reuse
    };
  }, []);

  // When the form becomes visible again, ensure Turnstile renders into the container
  useEffect(() => {
    if (!isSubmitted) {
      // clear any previous widget id so we force a fresh render
      widgetIdRef.current = null;
      // small timeout to allow form to mount and captchaRef to attach
      const t = setTimeout(() => renderTurnstile(), 50);
      return () => clearTimeout(t);
    }
  }, [isSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'name'
        ? sanitizeName(value)
        : name === 'organization'
          ? sanitizeOrganization(value)
          : name === 'phone'
            ? sanitizePhone(value)
            : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setFormData((prev) => ({ ...prev, services: service }));
    setIsServiceDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) throw new Error('Name can contain only letters and spaces.');
      if (!/^[A-Za-z0-9\s]+$/.test(formData.organization.trim())) throw new Error('Organization can contain only letters, numbers, and spaces.');
      if (!/^\d{10}$/.test(formData.phone)) throw new Error('Phone number must be exactly 10 digits.');
      if (!captchaToken) {
        throw new Error('Please complete the captcha before submitting.');
      }

      const payload = { ...formData, captchaToken };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || body?.error || 'Failed to send email');
      }

      setIsSubmitted(true);
      // reset turnstile widget after successful submit
      try {
        const win = window as any;
        if (win.turnstile && widgetIdRef.current != null) {
          win.turnstile.reset(widgetIdRef.current);
          setCaptchaToken(null);
        }
      } catch (e) {}
    } catch (err) {
      setError((err as Error).message || 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const serviceCategories = [
    {
      category: 'Workforce Solutions',
      options: [
        'Staffing & RPO',
        'VMS / Contingent Workforce',
        'HR SOW Services',
        'Payroll Services',
        'Professional Services'
      ]
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-28 font-sans text-white scroll-mt-24 lg:scroll-mt-28" id="workforce-cta-form">
      {/* Dynamic Background Gradients & Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Branding, Content, Trust Indicators */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-[#14C1F4] border border-[#14C1F4]/20">
                Workforce Solutions
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Ready to <span className="text-[#14C1F4] bg-clip-text text-transparent bg-gradient-to-r from-[#14C1F4] to-blue-400">Scale, Build,</span> or Optimize Your Workforce?
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                Let's collaborate to accelerate your hiring speed, find premium contract talent, or manage compliance with customized global payroll services.
              </p>
            </div>

          </div>

          {/* Right Column: CTA Form */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Outer Decorative Glow */}
              <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-[#14C1F4] to-blue-600 opacity-10 blur-xl"></div>

              <div className="relative bg-white border border-gray-100 rounded-[2rem] p-8 lg:p-10 shadow-2xl text-slate-900">
                {/* Turnstile captcha widget container - keep mounted so it survives form toggle */}
                <div className="mb-4">
                  <div ref={captchaRef} />
                </div>

                {isSubmitted ? (
                  /* Success State Layout */
                  <div className="py-16 text-center flex flex-col items-center justify-center min-h-[480px]">
                    <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Request Received!</h3>
                    <p className="text-slate-600 max-w-sm mx-auto text-sm leading-relaxed mb-8">
                      Thank you, <span className="text-[#14C1F4] font-bold">{formData.name}</span>. Our expert team will review your requirements for <span className="font-bold text-slate-900">{formData.organization}</span> and reach out to you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          organization: '',
                          phone: '',
                          hqLocation: '',
                          services: '',
                          message: ''
                        });
                        setSelectedService('');
                        setError(null);
                        // reset Captcha widget when returning to form
                        try {
                          const win = window as any;
                          if (win.turnstile && widgetIdRef.current != null) {
                            win.turnstile.reset(widgetIdRef.current);
                            setCaptchaToken(null);
                          }
                        } catch (e) {}
                      }}
                      className="px-6 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold tracking-widest uppercase transition-all duration-300 text-slate-600 cursor-pointer"
                    >
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  /* The Form Layout */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Let’s Start a Conversation</h3>
                      <p className="text-xs text-slate-500 mt-1">Please fill in the details below, and our team will prepare a custom proposal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </span>
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            inputMode="text"
                            placeholder="John Doe"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#14C1F4] focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all outline-none text-slate-900 placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </span>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#14C1F4] focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all outline-none text-slate-900 placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Organization */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organization</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          </span>
                          <input
                            required
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            inputMode="text"
                            placeholder="Company Name"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#14C1F4] focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all outline-none text-slate-900 placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Phone No */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone No.</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </span>
                          <input
                            required
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10 digit phone number"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#14C1F4] focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm transition-all outline-none text-slate-900 placeholder-slate-400"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Company headquarters location */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company headquarters location</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </span>
                        <select
                          required
                          name="hqLocation"
                          value={formData.hqLocation}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#14C1F4] focus:bg-white rounded-xl pl-11 pr-10 py-3 text-sm transition-all outline-none text-slate-900 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-white text-slate-400">Select Headquarters Location</option>
                          <option value="USA" className="bg-white text-gray-900">USA</option>
                          <option value="India" className="bg-white text-gray-900">India</option>
                          <option value="UK" className="bg-white text-gray-900">UK</option>
                          <option value="Australia" className="bg-white text-gray-900">Australia</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </div>
                    </div>

                    {/* What services are you looking for? (Premium custom dropdown) */}
                    <div className="space-y-1.5 relative" ref={dropdownRef}>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">What services are you looking for?</label>
                      <div
                        className="relative cursor-pointer"
                        onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                      >
                        <div className={`w-full bg-gray-50 border ${isServiceDropdownOpen ? 'border-[#14C1F4] bg-white' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-all text-slate-900`}>
                          <span className={selectedService ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                            {selectedService || "Select Service Option"}
                          </span>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Custom dropdown selections list */}
                        <div
                          className={`absolute top-full left-0 w-full mt-2 bg-white border border-gray-200/80 rounded-2xl shadow-2xl overflow-hidden z-50 transition-all origin-top ${isServiceDropdownOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'
                            }`}
                        >
                          <div className="max-h-[250px] overflow-y-auto scrollbar-thin">
                            {serviceCategories.map((group, groupIndex) => (
                              <div key={group.category} className={groupIndex !== 0 ? 'border-t border-gray-100' : ''}>
                                <div className="bg-gray-50 px-4 py-2 text-[9px] font-black text-[#14C1F4] uppercase tracking-wider">
                                  {group.category}
                                </div>
                                {group.options.map((option) => (
                                  <div
                                    key={option}
                                    className={`px-4 py-2.5 text-xs hover:bg-blue-50 hover:text-[#14C1F4] transition-colors cursor-pointer ${selectedService === option ? 'bg-blue-50 text-[#14C1F4] font-bold' : 'text-slate-700'
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleServiceSelect(option);
                                    }}
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        required
                        type="hidden"
                        name="services"
                        value={formData.services}
                      />
                    </div>

                    {/* How can we help? */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">How can we help?</label>
                      <textarea
                        required
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your team size, hiring goals, or payroll requirements..."
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#14C1F4] focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-900 placeholder-slate-400 resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    {/* Turnstile captcha widget container */}
                    <div className="pt-2">
                      <div ref={captchaRef} />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                      type="submit"
                      disabled={isLoading}
                      aria-busy={isLoading}
                      className={`w-full bg-[#14C1F4] ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-[#0c1d5e] hover:shadow-xl hover:shadow-blue-500/10'} active:scale-[0.98] text-slate-950 hover:text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 ${isLoading ? '' : 'cursor-pointer'} shadow-lg shadow-slate-200`}
                    >
                      {isLoading ? 'Sending...' : 'Submit Request'}
                      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WorkforceCTAForm;
