import React, { useMemo, useState } from "react";
import {
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

const VehicleScannerPage = () => {
  const [profile, setProfile] = useState(getInitialProfile);
  const [generatedProfile, setGeneratedProfile] = useState(getInitialProfile);
  const [hasGenerated, setHasGenerated] = useState(
    new URLSearchParams(window.location.search).has("phone")
  );
  const [copied, setCopied] = useState(false);

  const scanUrl = useMemo(() => buildScanUrl(generatedProfile), [generatedProfile]);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    scanUrl
  )}`;
  const phoneNumber = cleanPhone(generatedProfile.phone);
  const whatsappText = encodeURIComponent(
    `Hi ${generatedProfile.ownerName}, I scanned your ${generatedProfile.vehicleType} QR code for ${generatedProfile.vehicleNumber}. Please contact me.`
  );

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
    window.history.replaceState({}, "", buildScanUrl(nextProfile));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#111827]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-4 py-6 md:px-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111827] text-white">
              <QrCode size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563eb]">
                Smart Vehicle QR
              </p>
              <h1 className="text-3xl font-bold md:text-5xl">
                Apna vehicle contact QR banao
              </h1>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Owner details save karo",
              "Custom message likho",
              "QR scan page ready ho jayega",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
              >
                <CheckCircle2 className="text-[#16a34a]" size={20} />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleGenerate}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Login / owner setup</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ye details QR scan karne wale person ko contact card mein dikhenge.
                </p>
              </div>
              <ShieldCheck className="shrink-0 text-[#2563eb]" size={28} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">Owner name</span>
                <input
                  required
                  value={profile.ownerName}
                  onChange={(event) => updateField("ownerName", event.target.value)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f8fafc] px-4 outline-none transition focus:border-[#2563eb] focus:bg-white"
                  placeholder="Your name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Mobile number</span>
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
                <span className="text-sm font-semibold">Vehicle type</span>
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
                <span className="text-sm font-semibold">Vehicle number</span>
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
              <span className="text-sm font-semibold">Custom message</span>
              <textarea
                required
                value={profile.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="min-h-28 w-full resize-none rounded-xl border border-black/10 bg-[#f8fafc] px-4 py-3 outline-none transition focus:border-[#2563eb] focus:bg-white"
                placeholder="Write message for the person scanning your QR"
              />
            </label>

            <button
              type="submit"
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8]"
            >
              <QrCode size={20} />
              Generate QR Template
            </button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Generated QR</p>
                <h2 className="text-2xl font-bold">
                  {hasGenerated ? "Ready to print" : "Preview"}
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2ff] text-[#2563eb]">
                <QrCode size={24} />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-black/10 bg-[#f8fafc] p-4 text-center">
              <img
                src={qrImageUrl}
                alt="Vehicle contact QR code"
                className="mx-auto h-64 w-64 rounded-xl bg-white p-3"
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
              <p className="mt-3 text-center text-sm font-semibold text-[#16a34a]">
                Link copied
              </p>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
            <div className="bg-[#111827] px-6 py-7 text-center text-white">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                {generatedProfile.vehicleType === "Bike" ||
                generatedProfile.vehicleType === "Scooter" ? (
                  <Bike size={34} />
                ) : (
                  <Car size={34} />
                )}
              </div>
              <h2 className="text-2xl font-bold">Vehicle Contact</h2>
              <p className="mt-1 text-sm text-white/75">
                Scan and contact vehicle owner
              </p>
            </div>

            <div className="px-6 py-6">
              <div className="mb-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
                  {generatedProfile.vehicleNumber}
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Need to contact {generatedProfile.ownerName}?
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {generatedProfile.message}
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
        </aside>
      </section>
    </main>
  );
};

export default VehicleScannerPage;
