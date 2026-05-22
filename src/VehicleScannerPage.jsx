/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Bike,
  Car,
  CheckCircle2,
  Copy,
  Download,
  Mail,
  MessageCircle,
  Phone,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const defaultProfile = {
  ownerName: "Rahul Sharma",
  phone: "9912135070",
  vehicleType: "Car",
  vehicleNumber: "DL 01 AB 1234",
  message:
    "I am away from my vehicle. If it is blocking your way, please call or WhatsApp me.",
};

const getInitialProfile = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    ownerName: params.get("name") || defaultProfile.ownerName,
    phone: params.get("phone") || defaultProfile.phone,
    vehicleType: params.get("type") || defaultProfile.vehicleType,
    vehicleNumber: params.get("vehicle") || defaultProfile.vehicleNumber,
    message: params.get("msg") || defaultProfile.message,
  };
};

const cleanPhone = (phone) => phone.replace(/\D/g, "");

const buildScanUrl = (profile) => {
  const params = new URLSearchParams({
    name: profile.ownerName.trim(),
    phone: cleanPhone(profile.phone),
    type: profile.vehicleType,
    vehicle: profile.vehicleNumber.trim(),
    msg: profile.message.trim(),
  });

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

const ContactCard = ({ profile }) => {
  const phoneNumber = cleanPhone(profile.phone);
  const whatsappText = encodeURIComponent(
    `Hi ${profile.ownerName}, I scanned your ${profile.vehicleType} QR code for ${profile.vehicleNumber}. Please contact me.`
  );
  const isTwoWheeler =
    profile.vehicleType === "Bike" || profile.vehicleType === "Scooter";

  return (
    <div className="w-full max-w-[430px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
      <div className="bg-[#111827] px-6 py-7 text-center text-white">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          {isTwoWheeler ? <Bike size={34} /> : <Car size={34} />}
        </div>
        <h1 className="text-2xl font-bold">Vehicle Contact</h1>
        <p className="mt-1 text-sm text-white/75">
          Scan and contact vehicle owner
        </p>
      </div>

      <div className="px-6 py-6">
        <div className="mb-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
            {profile.vehicleNumber}
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Need to contact {profile.ownerName}?
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {profile.message}
          </p>
        </div>

        <div className="mb-5 rounded-xl bg-[#eff6ff] p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            Owner Number
          </p>
          <p className="mt-1 text-2xl font-bold text-[#2563eb]">
            +91 {phoneNumber}
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={`tel:+91${phoneNumber}`}
            className="flex h-12 items-center justify-center gap-3 rounded-xl bg-[#2563eb] font-bold text-white transition hover:bg-[#1d4ed8]"
          >
            <Phone size={19} />
            Call Owner
          </a>
          <a
            href={`https://wa.me/91${phoneNumber}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-3 rounded-xl bg-[#16a34a] font-bold text-white transition hover:bg-[#15803d]"
          >
            <MessageCircle size={19} />
            WhatsApp
          </a>
          <a
            href={`sms:+91${phoneNumber}?body=${whatsappText}`}
            className="flex h-12 items-center justify-center gap-3 rounded-xl bg-[#111827] font-bold text-white transition hover:bg-black"
          >
            <Mail size={19} />
            Send SMS
          </a>
        </div>
      </div>
    </div>
  );
};

const Header = ({ view, setView, hasGenerated }) => {
  const navItems = [
    { id: "welcome", label: "Welcome" },
    { id: "setup", label: "Owner Setup" },
    { id: "qr", label: "My QR", disabled: !hasGenerated },
  ];

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-8">
      <button
        type="button"
        onClick={() => setView("welcome")}
        className="flex items-center gap-3"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111827] text-white shadow-lg shadow-black/10">
          <QrCode size={23} />
        </span>
        <span className="text-left">
          <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-[#2563eb]">
            Smart Vehicle
          </span>
          <span className="block text-lg font-black">QR Scanner</span>
        </span>
      </button>

      <nav className="flex rounded-2xl border border-black/10 bg-white p-1 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => setView(item.id)}
            className={`h-10 rounded-xl px-3 text-sm font-bold transition md:px-5 ${
              view === item.id
                ? "bg-[#111827] text-white"
                : "text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

const VehicleScannerPage = () => {
  const scanParams = new URLSearchParams(window.location.search);
  const isScanMode = scanParams.has("phone");
  const initialProfile = getInitialProfile();
  const [view, setView] = useState("welcome");
  const [profile, setProfile] = useState(initialProfile);
  const [generatedProfile, setGeneratedProfile] = useState(initialProfile);
  const [hasGenerated, setHasGenerated] = useState(isScanMode);
  const [copied, setCopied] = useState(false);

  const scanUrl = useMemo(() => buildScanUrl(generatedProfile), [generatedProfile]);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(
    scanUrl
  )}`;

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    const nextProfile = {
      ...profile,
      phone: cleanPhone(profile.phone),
      ownerName: profile.ownerName.trim(),
      vehicleNumber: profile.vehicleNumber.trim().toUpperCase(),
      message: profile.message.trim(),
    };

    setGeneratedProfile(nextProfile);
    setProfile(nextProfile);
    setHasGenerated(true);
    setView("qr");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (isScanMode) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4 py-6 text-[#111827]">
        <ContactCard profile={generatedProfile} />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fb] text-[#111827]">
      <Header view={view} setView={setView} hasGenerated={hasGenerated} />

      {view === "welcome" && (
        <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-10 pt-2 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#2563eb] shadow-sm">
              <Sparkles size={17} />
              Parking problem ka smart answer
            </div>
            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Car aur bike ke liye instant contact QR.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Owner details add karo, custom message set karo, aur ek clean QR
              template ready ho jayega. Scan karne wale ko sirf contact info
              dikhegi.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setView("setup")}
                className="flex h-13 items-center justify-center gap-3 rounded-xl bg-[#2563eb] px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8]"
              >
                Start Owner Setup
                <ArrowRight size={19} />
              </button>
              <button
                type="button"
                onClick={() => setView(hasGenerated ? "qr" : "setup")}
                className="flex h-13 items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-6 font-bold text-[#111827] shadow-sm transition hover:bg-gray-50"
              >
                <QrCode size={19} />
                My QR
              </button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["No app install", "Call WhatsApp SMS", "Print ready QR"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
                  >
                    <CheckCircle2 className="text-[#16a34a]" size={20} />
                    <span className="text-sm font-bold">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative mx-auto flex h-[520px] w-full max-w-[520px] items-center justify-center">
            <div className="absolute h-[360px] w-[360px] rounded-full border border-[#2563eb]/20 smart-orbit" />
            <div className="absolute h-[470px] w-[470px] rounded-full border border-[#16a34a]/20 smart-orbit-reverse" />
            <div className="absolute left-6 top-16 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-lg smart-float">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                Scan result
              </p>
              <p className="mt-1 font-black">Owner info only</p>
            </div>
            <div className="absolute bottom-14 right-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-lg smart-float-delay">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                Actions
              </p>
              <p className="mt-1 font-black">Call / WhatsApp / SMS</p>
            </div>

            <div className="relative w-[310px] rounded-[28px] border border-black/10 bg-white p-5 shadow-2xl smart-phone">
              <div className="rounded-2xl bg-[#111827] px-5 py-6 text-center text-white">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Car size={30} />
                </div>
                <p className="text-sm text-white/70">Vehicle Contact</p>
                <h2 className="mt-1 text-2xl font-black">DL 01 AB 1234</h2>
              </div>
              <div className="space-y-3 p-4">
                <div className="h-4 rounded-full bg-gray-200" />
                <div className="h-4 w-4/5 rounded-full bg-gray-200" />
                <div className="mt-4 flex h-12 items-center justify-center rounded-xl bg-[#2563eb] font-bold text-white">
                  Call Owner
                </div>
                <div className="flex h-12 items-center justify-center rounded-xl bg-[#16a34a] font-bold text-white">
                  WhatsApp
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "setup" && (
        <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-10 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#2563eb]">
              Step 1
            </p>
            <h1 className="text-4xl font-black md:text-6xl">
              Owner setup complete karo.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
              Ye form QR ke andar save hone wali public contact info banata hai.
              QR scan karne wale ko sirf yahi clean card dikhega.
            </p>
          </div>

          <form
            onSubmit={handleGenerate}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-xl md:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Login / owner setup</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Apna number, vehicle detail aur message add karo.
                </p>
              </div>
              <ShieldCheck className="shrink-0 text-[#2563eb]" size={30} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold">Owner name</span>
                <input
                  required
                  value={profile.ownerName}
                  onChange={(event) => updateField("ownerName", event.target.value)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f8fafc] px-4 outline-none transition focus:border-[#2563eb] focus:bg-white"
                  placeholder="Your name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold">Mobile number</span>
                <input
                  required
                  value={profile.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f8fafc] px-4 outline-none transition focus:border-[#2563eb] focus:bg-white"
                  inputMode="tel"
                  placeholder="10 digit number"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold">Vehicle type</span>
                <select
                  value={profile.vehicleType}
                  onChange={(event) => updateField("vehicleType", event.target.value)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f8fafc] px-4 outline-none transition focus:border-[#2563eb] focus:bg-white"
                >
                  <option>Car</option>
                  <option>Bike</option>
                  <option>Scooter</option>
                  <option>Truck</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold">Vehicle number</span>
                <input
                  required
                  value={profile.vehicleNumber}
                  onChange={(event) =>
                    updateField("vehicleNumber", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f8fafc] px-4 uppercase outline-none transition focus:border-[#2563eb] focus:bg-white"
                  placeholder="DL 01 AB 1234"
                />
              </label>
            </div>

            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold">Custom message</span>
              <textarea
                required
                value={profile.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="min-h-32 w-full resize-none rounded-xl border border-black/10 bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:bg-white"
                placeholder="Write message for the person scanning your QR"
              />
            </label>

            <button
              type="submit"
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8]"
            >
              <QrCode size={20} />
              Generate and open My QR
            </button>
          </form>
        </section>
      )}

      {view === "qr" && (
        <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-10 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#2563eb]">
                Step 2
              </p>
              <h1 className="text-4xl font-black md:text-6xl">Your QR is ready.</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                Is QR ko sticker ya card par print karo. Scan karne wale ko
                right side wala contact page hi dikhega, generator nahi.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">Generated QR</p>
                  <h2 className="text-2xl font-black">Ready to print</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2ff] text-[#2563eb]">
                  <QrCode size={24} />
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-black/10 bg-[#f8fafc] p-4 text-center">
                <img
                  src={qrImageUrl}
                  alt="Vehicle contact QR code"
                  className="mx-auto h-72 w-72 rounded-xl bg-white p-3"
                />
                <p className="mt-3 break-all text-xs text-gray-500">{scanUrl}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white text-gray-700 transition hover:bg-gray-50"
                  title="Copy link"
                >
                  <Copy size={18} />
                </button>
                <a
                  href={qrImageUrl}
                  download="vehicle-contact-qr.png"
                  className="flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white text-gray-700 transition hover:bg-gray-50"
                  title="Download QR"
                >
                  <Download size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white text-gray-700 transition hover:bg-gray-50"
                  title="Print template"
                >
                  <Printer size={18} />
                </button>
              </div>
              {copied && (
                <p className="mt-3 text-center text-sm font-bold text-[#16a34a]">
                  Link copied
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ContactCard profile={generatedProfile} />
          </div>
        </section>
      )}
    </main>
  );
};

export default VehicleScannerPage;
