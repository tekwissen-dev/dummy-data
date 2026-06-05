"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const images={
  flagUK: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477798/uk_t5bjee.png',
  flagUSA: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477670/usa_ck8eka.png',
  flagIndia: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477672/india_suy7yt.png',
  flagPortugal: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477800/portugal_jhbhdr.png',
  flagAustralia: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477680/Austrila_wj9kft.png',
  flagCanada: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477795/canada_cbxrrb.png',
  flagUAE: 'https://res.cloudinary.com/db5txrfvb/image/upload/v1780477803/uae_pn0iq5.png'
}
declare const THREE: any;

interface Office {
  id: string; city: string; country: string;
  address: string; phone: string; email: string;
  timezone: string; team: number; isHQ?: boolean; hqLabel?: string;
  lat: number; lng: number; mapsUrl: string;
}

const OFFICES: Office[] = [
  // ── USA ──────────────────────────────────────────────────────────────────
  {
    id: "annarbor", city: "Ann Arbor", country: "United States",
    address: "TekWissen\u00ae \u2013 HQ\n581 State Cir, Suite A\nAnn Arbor, MI 48108\nFAX: 734-468-0881",
    phone: "+1 734-259-2181", email: "annarbor@tekwissen.com",
    timezone: "EST (UTC\u22125)", team: 240, lat: 42.27, lng: -83.74,
    mapsUrl: "https://maps.google.com/?q=581+State+Cir+Ann+Arbor+MI+48108"
  },
  // ── Canada ────────────────────────────────────────────────────────────────
  {
    id: "toronto", city: "Toronto", country: "Canada",
    address: "TekWissen Consulting Inc.\n181 University Avenue, Suite 2100\nToronto ON, M5H 3M7",
    phone: "+1 437 266 1717", email: "toronto@tekwissen.com",
    timezone: "EST (UTC\u22125)", team: 0, lat: 43.65, lng: -79.38,
    mapsUrl: "https://maps.google.com/?q=181+University+Avenue+Toronto+ON+M5H3M7"
  },
  // ── Australia ─────────────────────────────────────────────────────────────
  {
    id: "goldcoast", city: "Gold Coast", country: "Australia",
    address: "TekWissen Pty Ltd\nGold Coast\nQLD 4211, Australia",
    phone: "+61 451 836 793", email: "australia@tekwissen.com",
    timezone: "AEST (UTC+10)", team: 0, lat: -28.02, lng: 153.43,
    mapsUrl: "https://maps.google.com/?q=Gold+Coast+QLD+4211+Australia"
  },
  // ── United Kingdom ────────────────────────────────────────────────────────
  {
    id: "london", city: "London", country: "United Kingdom",
    address: "TekWissen UK Pvt Ltd\nNorth West House\n119 Marylebone Road\nLondon, NW1 5PU, UK",
    phone: "", email: "london@tekwissen.com",
    timezone: "GMT (UTC+0)", team: 0, lat: 51.52, lng: -0.16,
    mapsUrl: "https://maps.google.com/?q=119+Marylebone+Road+London+NW1+5PU"
  },
  // ── India ─────────────────────────────────────────────────────────────────
  {
    id: "lucknow", city: "Lucknow", country: "India",
    address: "TekWissen Software Pvt. Ltd \u2013 HQ\nBBD Viraj Tower, Near High Court\n4th Floor, Beside Amar Shaheed Path\nVibhuti Khand, Gomti Nagar\nLucknow, Uttar Pradesh-226010",
    phone: "", email: "lucknow@tekwissen.com",
    timezone: "IST (UTC+5:30)", team: 0, lat: 26.86, lng: 80.99,
    mapsUrl: "https://maps.google.com/?q=BBD+Viraj+Tower+Gomti+Nagar+Lucknow"
  },
  {
    id: "visakhapatnam", city: "Visakhapatnam", country: "India",
    address: "TekWissen Software Pvt. Ltd\nPlot No. 1 & 2A, Survey no. 141\nNear RTA office, APIIC Park\nGambheeram, Visakhapatnam-531163\nAndhra Pradesh",
    phone: "0891-2792181", email: "vizag@tekwissen.com",
    timezone: "IST (UTC+5:30)", team: 0, lat: 17.79, lng: 83.22,
    mapsUrl: "https://maps.google.com/?q=APIIC+Park+Gambheeram+Visakhapatnam+531163"
  },
  {
    id: "bangalore", city: "Bangalore", country: "India",
    address: "TekWissen Software Pvt. Ltd.\nPrestige Omega Building, 1st Floor\nUnit No 102, Nallurahalli Main Road\nWhitefield, Bengaluru\nKarnataka, 560066",
    phone: "", email: "bangalore@tekwissen.com",
    timezone: "IST (UTC+5:30)", team: 0, lat: 12.97, lng: 77.75,
    mapsUrl: "https://maps.google.com/?q=Prestige+Omega+Building+Whitefield+Bengaluru+560066"
  },
  {
    id: "hyderabad", city: "Hyderabad", country: "India",
    address: "TekWissen Software Pvt. Ltd.\n2nd Floor, Purva Summit\nWhite Field Rd, Kondapur\nWhitefields, HITEC City\nHyderabad-500084, Telangana",
    phone: "", email: "hyderabad@tekwissen.com",
    timezone: "IST (UTC+5:30)", team: 0, lat: 17.46, lng: 78.36,
    mapsUrl: "https://maps.google.com/?q=Purva+Summit+Kondapur+Hyderabad+500084"
  },
  // ── UAE ───────────────────────────────────────────────────────────────────
  {
    id: "dubai", city: "Dubai", country: "UAE",
    address: "TekWissen Consulting Services\nDubai Marina, Level 33\nMarina Plaza\nDubai, AE",
    phone: "", email: "dubai@tekwissen.com",
    timezone: "GST (UTC+4)", team: 0, lat: 25.08, lng: 55.14,
    mapsUrl: "https://maps.google.com/?q=Marina+Plaza+Dubai+Marina+Dubai"
  },
  // ── Portugal ──────────────────────────────────────────────────────────────
  {
    id: "lisbon", city: "Lisbon", country: "Portugal",
    address: "Senta's Europe-Unipessoal LDA\nR. Alexandre Herculano 50\n1250-011 Lisboa, Portugal",
    phone: "", email: "lisbon@tekwissen.com",
    timezone: "WET (UTC+0)", team: 0, lat: 38.72, lng: -9.15,
    mapsUrl: "https://maps.google.com/?q=R+Alexandre+Herculano+50+Lisboa+Portugal"
  },
];


// ── GLSL ──────────────────────────────────────────────────────────────────────
const EARTH_VERT = `
  varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorldPos;
  void main(){
    vUv=uv;
    vNormal=normalize((modelMatrix*vec4(normal,0.0)).xyz);
    vWorldPos=(modelMatrix*vec4(position,1.0)).xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
  }`;

const EARTH_FRAG = `
  uniform sampler2D uDay,uNight,uClouds;
  uniform vec3 uSunDir,uCamPos;
  varying vec2 vUv; varying vec3 vNormal,vWorldPos;
  void main(){
    vec3 N=normalize(vNormal),L=normalize(uSunDir),V=normalize(uCamPos-vWorldPos);
    float t=smoothstep(-0.20,0.26,dot(N,L));
    vec3 day=texture2D(uDay,vUv).rgb;
    vec3 night=texture2D(uNight,vUv).rgb*2.1;
    float cloud=texture2D(uClouds,vUv).r*0.72*t;
    float spec=pow(max(dot(N,normalize(L+V)),0.0),90.0)*0.40*t;
    vec3 col=mix(night,day,t);
    col=mix(col,vec3(1.0),cloud); col+=spec;
    col+=vec3(0.06,0.14,0.34)*pow(1.0-max(dot(N,V),0.0),4.0)*t*0.55;
    gl_FragColor=vec4(col,1.0);
  }`;



// ── Helpers ───────────────────────────────────────────────────────────────────
function loadScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    if ((window as any).THREE) { res(); return; }
    if (document.querySelector(`script[src="${src}"]`)) {
      const t = setInterval(() => { if ((window as any).THREE) { clearInterval(t); res(); } }, 50);
      return;
    }
    const s = document.createElement("script");
    s.src = src; s.onload = () => res(); s.onerror = () => rej();
    document.head.appendChild(s);
  });
}

function latLngToVec3(lat: number, lng: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new (window as any).THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ── Office Card (light theme) ─────────────────────────────────────────────────
const OfficeCard: React.FC<{
  office: Office; sx: number; sy: number; cw: number; ch: number; onClose: () => void;
}> = ({ office, sx, sy, cw, ch, onClose }) => {
  const W = 294, H = 400;
  let left = sx + 26, top = sy - 65;
  if (left + W > cw - 8) left = sx - W - 18;
  if (left < 8) left = 8;
  if (top + H > ch - 8) top = ch - H - 8;
  if (top < 8) top = 8;
  const arrowLeft = left > sx;

  return (
    <div style={{
      position: "absolute", left, top, width: W, zIndex: 500,
      fontFamily: "'Outfit',sans-serif",
      animation: "card-in .22s cubic-bezier(.34,1.56,.64,1) both",
      pointerEvents: "all"
    }}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      {/* arrow */}
      {arrowLeft && (
        <div style={{
          position: "absolute", left: -7, top: 56, width: 14, height: 14,
          background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
          borderRight: "none", borderTop: "none",
          transform: "rotate(45deg)", zIndex: 1,
          boxShadow: "-2px 2px 4px rgba(0,0,0,0.04)"
        }} />
      )}

      <div style={{
        background: "#ffffff",
        borderRadius: 18, overflow: "hidden", position: "relative", zIndex: 2,
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(37,99,235,0.08)"
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#0c1d5e 0%,#1740b0 55%,#14C1F4 100%)",
          padding: "18px 18px 15px", position: "relative", overflow: "hidden"
        }}>
          {[[-14, -14, 88], [200, 25, 64], [65, 52, 40]].map(([rx, ry, sz], i) => (
            <div key={i} style={{
              position: "absolute", left: rx, top: ry, width: sz, height: sz,
              borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none"
            }} />
          ))}
          {office.isHQ && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(245,158,11,0.22)", border: "1px solid rgba(245,158,11,0.55)",
              borderRadius: 999, padding: "2px 10px", marginBottom: 9
            }}>
              <span style={{ fontSize: 9.5, color: "#fcd34d", fontWeight: 700, letterSpacing: "0.1em" }}>★ {office.hqLabel ?? "HEADQUARTERS"}</span>
            </div>
          )}
          <div style={{ fontSize: 21, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>{office.city}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", marginTop: 3 }}>{office.country}</div>
          <button onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12, width: 27, height: 27,
              borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)",
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", transition: "background .15s", fontFamily: "inherit"
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)")}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px 16px" }}>
          {/* Chips */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { icon: "🕐", label: "Timezone", val: office.timezone },
              { icon: "👥", label: "Team", val: `${office.team} people` },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{
                background: "#f0f5ff", border: "1px solid #dbeafe",
                borderRadius: 10, padding: "8px 10px"
              }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginBottom: 3 }}>{icon} {label}</div>
                <div style={{ fontSize: 11.5, color: "#1e40af", fontWeight: 600, lineHeight: 1.3 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Info rows */}
          {[
            { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#14C1F4" strokeWidth="1.6"><path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5S12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" /><circle cx="8" cy="6" r="1.5" /></svg>, label: "Address", val: office.address, mono: false },
            { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#14C1F4" strokeWidth="1.6"><path d="M2 2.5c0-.5.5-1 1.5-1H5l1.5 3.5L5 6c.5 1.5 3.5 4.5 5 5l1-1.5 3.5 1.5V12.5c0 1-.5 1.5-1 1.5C6.5 13.5 1.5 7 2 2.5z" /></svg>, label: "Phone", val: office.phone, mono: true },
            { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#14C1F4" strokeWidth="1.6"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" /><path d="M1.5 4.5L8 9l6.5-4.5" /></svg>, label: "Email", val: office.email, mono: true },
          ].map(({ icon, label, val, mono }) => (
            <div key={label} style={{ display: "flex", gap: 9, marginBottom: 9, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <div>
                <div style={{
                  fontSize: 9.5, color: "#94a3b8", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2
                }}>{label}</div>
                <div style={{
                  fontSize: 12, color: "#334155", lineHeight: 1.6,
                  whiteSpace: "pre-line", fontFamily: mono ? "'DM Mono',monospace" : "inherit"
                }}>{val}</div>
              </div>
            </div>
          ))}

          {/* CTA */}
          <a href={office.mapsUrl} target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              marginTop: 12, padding: "10px 0",
              background: "linear-gradient(135deg,#14C1F4,#3b82f6)",
              borderRadius: 11, color: "#fff", fontSize: 13, fontWeight: 600,
              textDecoration: "none", letterSpacing: "0.02em",
              fontFamily: "'Outfit',sans-serif",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
              transition: "opacity .15s,transform .15s"
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = ".85"; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

// ── Pin Overlay ───────────────────────────────────────────────────────────────
const PinOverlay: React.FC<{
  office: Office; x: number; y: number; visible: boolean;
  active: boolean; hovered: boolean;
  onEnter: () => void; onLeave: () => void; onClick: (e: React.MouseEvent) => void;
}> = ({ office, x, y, visible, active, hovered, onEnter, onLeave, onClick }) => {
  if (!visible) return null;
  const lit = active || hovered;
  const col = office.isHQ ? "#f59e0b" : "#14C1F4";
  const sz = lit ? 42 : 34;
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: "translate(-50%,-100%)",
      cursor: "pointer", zIndex: lit ? 150 : 100, pointerEvents: "all"
    }}
      onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}
    >
      {/* pulse rings */}
      <div style={{ position: "absolute", top: "32%", left: "50%", pointerEvents: "none" }}>
        {[0, .75, 1.5].map(d => (
          <span key={d} style={{
            position: "absolute",
            transform: "translate(-50%,-50%)",
            width: 10, height: 10, borderRadius: "50%",
            border: `2px solid ${col}`,
            animation: `globe-pulse 2.6s ${d}s ease-out infinite`
          }} />
        ))}
      </div>
      <svg width={sz} height={Math.round(sz * 1.36)} viewBox="0 0 72 96"
        style={{
          display: "block",
          filter: lit
            ? `drop-shadow(0 0 10px ${col}bb) drop-shadow(0 4px 8px rgba(0,0,0,.28))`
            : "drop-shadow(0 3px 6px rgba(0,0,0,.22))",
          transition: "all .22s cubic-bezier(.34,1.56,.64,1)"
        }}>
        <defs>
          <radialGradient id={`pg${office.id}`} cx="36%" cy="22%" r="72%">
            <stop offset="0%" stopColor={office.isHQ ? "#fde68a" : "#93c5fd"} />
            <stop offset="100%" stopColor={col} />
          </radialGradient>
        </defs>
        <circle cx="36" cy="33" r="30"
          fill={office.isHQ ? "rgba(245,158,11,0.15)" : "rgba(37,99,235,0.12)"} />
        <path d="M36 5C15 5 8 22 8 33 8 52 36 82 36 82 36 82 64 52 64 33 64 22 57 5 36 5Z"
          fill={`url(#pg${office.id})`}
          stroke={office.isHQ ? "#b45309" : "#1e40af"} strokeWidth="2" />
        <circle cx="36" cy="33" r="11" fill="rgba(255,255,255,.95)" />
        {office.isHQ
          ? <path d="M36 25L38.4 31.2 45 31.2 39.8 35.1 41.7 41.3 36 37.5 30.3 41.3 32.2 35.1 27 31.2 33.6 31.2Z" fill={col} />
          : <circle cx="36" cy="33" r="5" fill={col} />
        }
        <ellipse cx="36" cy="86" rx="12" ry="3.5" fill="rgba(0,0,0,.15)" />
      </svg>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const GlobePresence: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<{
    renderer: any; scene: any; camera: any;
    earth: any; earthMat: any;
    markerGroup: any; basePositions: Map<string, any>;
    rafId: number; isDragging: boolean; lastMx: number; lastMy: number;
    velX: number; velY: number; autoRotate: boolean; targetRotY: number | null;
  } | null>(null);

  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pins, setPins] = useState<Map<string, { x: number; y: number; visible: boolean }>>(new Map());
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const activeIdRef = useRef<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    phone: '',
    hqLocation: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  // Interest Dropdown States
  const [isInterestDropdownOpen, setIsInterestDropdownOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const sanitizeName = (value: string) => value.replace(/[^A-Za-z\s]/g, '');
  const sanitizeOrganization = (value: string) => value.replace(/[^A-Za-z0-9\s]/g, '');
  const sanitizePhone = (value: string) => value.replace(/\D/g, '').slice(0, 10);

  const renderTurnstile = useCallback(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) return;

    try {
      const win = window as any;
      if (win.turnstile && captchaRef.current) {
        if (widgetIdRef.current != null) {
          try {
            win.turnstile.reset(widgetIdRef.current);
            return;
          } catch (e) {}
        }

        widgetIdRef.current = win.turnstile.render(captchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken(null),
        });
      }
    } catch (e) {}
  }, []);


  useEffect(() => {
    let dead = false, cleanup: null | (() => void) = null;
    (async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
      if (dead || !mountRef.current) return;

      const cont = mountRef.current;
      const W = cont.clientWidth || 600, H = cont.clientHeight || 600;
      setDims({ w: W, h: H });

      const renderer = new (window as any).THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0xffffff, 0);
      Object.assign(renderer.domElement.style, {
        position: "absolute", inset: "0", width: "100%", height: "100%", cursor: "grab",
      });
      cont.appendChild(renderer.domElement);

      const scene = new (window as any).THREE.Scene();
      const camera = new (window as any).THREE.PerspectiveCamera(38, W / H, .1, 1000);
      camera.position.z = 3.5;

      const tl = new (window as any).THREE.TextureLoader(); tl.crossOrigin = "anonymous";
      const ld = (url: string) => new Promise<any>(r => tl.load(url, r, undefined, () => r(null)));
      const [dayTex, nightTex, cloudTex] = await Promise.all([
        ld("https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg"),
        ld("https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg"),
        ld("https://unpkg.com/three-globe@2.31.0/example/img/earth-clouds.png"),
      ]);
      if (dead) return;

      const SUN = new (window as any).THREE.Vector3(5, 2, 4).normalize();

      const earthMat = new (window as any).THREE.ShaderMaterial({
        uniforms: {
          uDay: { value: dayTex },
          uNight: { value: nightTex },
          uClouds: { value: cloudTex },
          uSunDir: { value: SUN },
          uCamPos: { value: camera.position.clone() },
        },
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
      });

      const earth = new (window as any).THREE.Mesh(new (window as any).THREE.SphereGeometry(1, 80, 80), earthMat);
      earth.rotation.y = (20 * Math.PI) / 180;
      scene.add(earth);

      scene.add(new (window as any).THREE.AmbientLight(0x8899bb, 0.9));
      const sun = new (window as any).THREE.DirectionalLight(0xfff8f0, 1.4);
      sun.position.copy(SUN); scene.add(sun);
      const fill = new (window as any).THREE.DirectionalLight(0xbbccff, 0.3);
      fill.position.set(-5, -1, -3); scene.add(fill);

      const markerGroup = new (window as any).THREE.Group();
      markerGroup.rotation.copy(earth.rotation);
      scene.add(markerGroup);

      const basePositions = new Map<string, any>();
      OFFICES.forEach(o => basePositions.set(o.id, latLngToVec3(o.lat, o.lng, 1.04)));

      const gl = {
        renderer, scene, camera, earth, earthMat,
        markerGroup, basePositions,
        rafId: 0, isDragging: false, lastMx: 0, lastMy: 0,
        velX: 0, velY: 0, autoRotate: true, targetRotY: null as number | null,
      };
      glRef.current = gl;

      const cv = renderer.domElement;
      const onMD = (e: MouseEvent) => {
        gl.isDragging = true; gl.autoRotate = false;
        gl.lastMx = e.clientX; gl.lastMy = e.clientY;
        gl.velX = 0; gl.velY = 0; cv.style.cursor = "grabbing";
      };
      const onMM = (e: MouseEvent) => {
        if (!gl.isDragging) return;
        const dx = e.clientX - gl.lastMx, dy = e.clientY - gl.lastMy;
        gl.velY = dx * .0045; gl.velX = dy * .0045;
        earth.rotation.y += dx * .0045;
        earth.rotation.x = Math.max(-.65, Math.min(.65, earth.rotation.x + dy * .0045));
        markerGroup.rotation.y = earth.rotation.y;
        markerGroup.rotation.x = earth.rotation.x;
        gl.lastMx = e.clientX; gl.lastMy = e.clientY;
      };
      const onMU = () => {
        gl.isDragging = false;
        cv.style.cursor = "grab";
        gl.velX *= 0.5; gl.velY *= 0.5;
        setTimeout(() => {
          if (glRef.current) glRef.current.autoRotate = true;
        }, 1500);
      };
      const onResize = () => {
        if (!cont) return;
        const w = cont.clientWidth, h = cont.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        setDims({ w, h });
      };
      cv.addEventListener("mousedown", onMD);
      window.addEventListener("mousemove", onMM);
      window.addEventListener("mouseup", onMU);
      window.addEventListener("resize", onResize);

      const tick = () => {
        gl.rafId = requestAnimationFrame(tick);
        if (!gl.isDragging) {
          gl.velX *= .93; gl.velY *= .93;
          earth.rotation.x = Math.max(-.65, Math.min(.65, earth.rotation.x + gl.velX));
          if (gl.targetRotY !== null) {
            earth.rotation.y += (gl.targetRotY - earth.rotation.y) * .028;
            if (Math.abs(gl.targetRotY - earth.rotation.y) < .0015) {
              earth.rotation.y = gl.targetRotY;
              gl.targetRotY = null;
              gl.autoRotate = true;
            }
          } else if (gl.autoRotate) {
            earth.rotation.y += .0016;
          } else {
            earth.rotation.y += gl.velY;
          }
          markerGroup.rotation.y = earth.rotation.y;
          markerGroup.rotation.x = earth.rotation.x;
        }
        earthMat.uniforms.uCamPos.value.copy(camera.position);

        const cw = renderer.domElement.clientWidth;
        const ch = renderer.domElement.clientHeight;
        const map = new Map<string, { x: number; y: number; visible: boolean }>();
        OFFICES.forEach(o => {
          const base = basePositions.get(o.id)!;
          const v = base.clone().applyEuler(markerGroup.rotation);
          const visible = v.clone().normalize().dot(camera.position.clone().normalize()) > 0.05;
          const p = v.clone().project(camera);
          map.set(o.id, { x: (p.x * .5 + .5) * cw, y: (-p.y * .5 + .5) * ch, visible });
        });
        setPins(map);
        renderer.render(scene, camera);
      };
      tick();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(gl.rafId);
        cv.removeEventListener("mousedown", onMD);
        window.removeEventListener("mousemove", onMM);
        window.removeEventListener("mouseup", onMU);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (cv.parentNode === cont) cont.removeChild(cv);
      };
    })();
    return () => { dead = true; cleanup?.(); };
  }, []);

  useEffect(() => {
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
  }, [renderTurnstile]);

  useEffect(() => {
    if (!isSubmitted) {
      widgetIdRef.current = null;
      const t = setTimeout(() => renderTurnstile(), 50);
      return () => clearTimeout(t);
    }
  }, [isSubmitted, renderTurnstile]);

  const focusOffice = useCallback((o: Office) => {
    const gl = glRef.current; if (!gl) return;
    const tY = (-o.lng - 90) * Math.PI / 180;
    let d = tY - gl.earth.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    gl.targetRotY = gl.earth.rotation.y + d;
    gl.autoRotate = false;
  }, []);

  const handlePinClick = useCallback((o: Office, e: React.MouseEvent) => {
    e.stopPropagation();
    focusOffice(o);
    const next = activeIdRef.current === o.id ? null : o.id;
    activeIdRef.current = next;
    setActiveId(next);
  }, [focusOffice]);

  const handleClose = useCallback(() => {
    activeIdRef.current = null;
    setActiveId(null);
    if (glRef.current) glRef.current.autoRotate = true;
  }, []);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'firstName' || name === 'lastName'
        ? sanitizeName(value)
        : name === 'organization'
          ? sanitizeOrganization(value)
          : name === 'phone'
            ? sanitizePhone(value)
            : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!/^[A-Za-z\s]+$/.test(formData.firstName.trim())) throw new Error('First name can contain only letters and spaces.');
      if (!/^[A-Za-z\s]+$/.test(formData.lastName.trim())) throw new Error('Last name can contain only letters and spaces.');
      if (!/^[A-Za-z0-9\s]+$/.test(formData.organization.trim())) throw new Error('Organization can contain only letters, numbers, and spaces.');
      if (!/^\d{10}$/.test(formData.phone)) throw new Error('Phone number must be exactly 10 digits.');
      if (!captchaToken) {
        throw new Error('Please complete the captcha before submitting.');
      }

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        organization: formData.organization,
        phone: formData.phone,
        hqLocation: formData.hqLocation,
        services: selectedInterest || '',
        message: formData.message,
        captchaToken,
        formName: 'Global Presence',
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || body?.error || 'Failed to send email');
      }

      setIsSubmitted(true);
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
  }, [captchaToken, formData.email, formData.firstName, formData.lastName, formData.message, selectedInterest]);

  const activeOffice = OFFICES.find(o => o.id === activeId) || null;

  return (
    <div className="relative w-full bg-white font-sans min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes globe-pulse {
          0%   { transform:translate(-50%,-50%) scale(1);   opacity:.8; }
          100% { transform:translate(-50%,-50%) scale(4.5); opacity:0;  }
        }
        @keyframes card-in {
          from { opacity:0; transform:scale(.9) translateY(10px); }
          to   { opacity:1; transform:scale(1)  translateY(0);    }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>


      {/* Main Center Title Section */}
      <div className="max-w-[1440px] mx-auto px-6 pt-16 lg:pt-24 text-center animate-[fade-up_.6s_ease-out_both]">
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Our Offices, <span className="text-[#14C1F4]">World Wide</span>
        </h1>
        <div className="flex items-center justify-center gap-5">
          <p className="text-gray-500 font-medium text-lg lg:text-xl">
            Global presence across <span className="text-[#14C1F4] font-bold">7 Countries </span>and delivery hubs
          </p>
        </div>
        
      </div>

      

      {/* Main Grid Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* Left Column: Contact Form */}
        <div className="lg:col-span-5 animate-[fade-up_.6s_ease-out_both]">
          <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-gray-100 sticky top-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-[#14C1F4]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Start a <span className="text-[#14C1F4]">Conversation.</span>
              </h1>
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 text-lg">
              Whether you're looking to scale your engineering team or establish a new GCC, our consultants are ready to architect your expansion.
            </p>

            {/* Contact Quick Info */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 text-gray-700 font-medium">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#14C1F4]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                marketing@tekwissen.com
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {isSubmitted ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-900">
                  <div className="font-bold text-lg mb-1">Request received</div>
                  <p className="text-sm text-emerald-800">
                    Thanks {formData.firstName || 'there'}, our team will review your request and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                        setFormData({ firstName: '', lastName: '', email: '', organization: '', phone: '', hqLocation: '', message: '' });
                      setSelectedInterest(null);
                      setError(null);
                      try {
                        const win = window as any;
                        if (win.turnstile && widgetIdRef.current != null) {
                          win.turnstile.reset(widgetIdRef.current);
                          setCaptchaToken(null);
                        }
                      } catch (e) {}
                    }}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#14C1F4] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                          inputMode="text"
                          maxLength={50}
                        placeholder="Enter first name"
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-3.5 text-sm transition-all outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                          inputMode="text"
                          maxLength={50}
                        placeholder="Enter last name"
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-3.5 text-sm transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Work Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="name@company.com"
                      className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-3.5 text-sm transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleFormChange}
                      inputMode="text"
                      maxLength={100}
                      placeholder="Company name"
                      className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-3.5 text-sm transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 digit phone number"
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-3.5 text-sm transition-all outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">HQ Location</label>
                      <input
                        type="text"
                        name="hqLocation"
                        value={formData.hqLocation}
                        onChange={handleFormChange}
                        placeholder="City, Country"
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-3.5 text-sm transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Custom Interest Area Dropdown */}
                  <div className="space-y-1.5 relative interest-dropdown-container">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Interest Area</label>
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => setIsInterestDropdownOpen(!isInterestDropdownOpen)}
                    >
                      <div className={`w-full bg-gray-50 border ${isInterestDropdownOpen ? 'border-blue-500 bg-white shadow-[0_0_20px_rgba(20,193,244,0.1)]' : 'border-transparent'} rounded-xl px-5 py-3.5 text-sm transition-all outline-none flex items-center justify-between`}>
                        <span className={selectedInterest ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                          {selectedInterest ? selectedInterest.replace(/^[\s\u00A0]*\u21B3\s*/, "") : "Select your area of interest"}
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isInterestDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-0 w-full mt-2 bg-white border border-blue-50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 transition-all duration-300 origin-top ${isInterestDropdownOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-4 scale-95'}`}>
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                          {[
                            {
                              label: "Workforce Solutions",
                              options: [
                                "Staffing & RPO",
                                "\u00A0\u00A0\u21B3 Staffing",
                                "\u00A0\u00A0\u21B3 RPO",
                                "VMS / Contingent Solutions",
                                "\u00A0\u00A0\u21B3 VMS Implementation & Support",
                                "\u00A0\u00A0\u21B3 Master Vendor",
                                "\u00A0\u00A0\u21B3 Contingent Workforce",
                                "HR SOW Services",
                                "Professional IT Services",
                                "\u00A0\u00A0\u21B3 IT Infrastructure",
                                "\u00A0\u00A0\u21B3 IT Testing",
                                "\u00A0\u00A0\u21B3 SAP HANA",
                                "Payroll Solutions (AOR/EOR)",
                                "\u00A0\u00A0\u21B3 Agent of Records",
                                "\u00A0\u00A0\u21B3 Employee of Records",
                                "\u00A0\u00A0\u21B3 Subcontract Management"
                              ]
                            },
                            {
                              label: "AI Innovation Lab",
                              options: [
                                "AI Talent Development",
                                "AI Strategic Development",
                                "Train AI"
                              ]
                            },
                            {
                              label: "Global Capability Centers (GCC)",
                              options: [
                                "Build Operate Transfer (BOT)",
                                "Hybrid Captive Model",
                                "Joint Venture Partnerships",
                                "BPO Services"
                              ]
                            },
                            {
                              label: "Strategy, Consulting & Operations",
                              options: [
                                "Procurement",
                                "Change Management Solutions",
                                "Administrative Support",
                                "Supply Chain Optimization"
                              ]
                            }
                          ].map((group, gIdx) => (
                            <div key={group.label} className={gIdx !== 0 ? 'border-t border-gray-50' : ''}>
                              <div className="bg-gray-50/50 px-5 py-2.5 text-[10px] font-black text-[#14C1F4] uppercase tracking-[0.2em]">
                                {group.label}
                              </div>
                              {group.options.map((opt) => {
                                const isSubservice = opt.startsWith("\u00A0");
                                return (
                                  <div
                                    key={opt}
                                    className={`px-5 py-3 text-sm transition-colors cursor-pointer hover:bg-blue-50 hover:text-[#14C1F4] ${
                                      isSubservice
                                        ? 'pl-8 text-gray-500 font-normal text-xs'
                                        : 'font-semibold text-gray-800'
                                    } ${selectedInterest === opt ? 'bg-blue-50/50 text-[#14C1F4]' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedInterest(opt);
                                      setIsInterestDropdownOpen(false);
                                    }}
                                  >
                                    {opt}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Describe your project goals..."
                      className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-5 py-4 text-sm transition-all outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <div ref={captchaRef} />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className={`w-full bg-[#14C1F4] ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-[#0ea5e9]'} cursor-pointer text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 mt-6 text-sm uppercase tracking-widest`}
                  >
                    {isLoading ? 'Sending...' : 'Send Request'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6 font-medium">
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 9.503l7.834-4.603a1 1 0 00-.834-1.833L10 7.667 3 3.067a1 1 0 00-.834 1.833z" /></svg>
                Your information is safe with us. We respect your privacy.
              </div>
            </form>
            </div>
          </div>

        {/* Right Column: Globe Section */}
        <div className="lg:col-span-7 flex flex-col pt-8">

          {/* Globe Render */}
          <div className="relative flex-1 min-h-[600px] lg:min-h-[700px] animate-[fade-up_.8s_ease-out_.4s_both]">
            {/* Canvas Container */}
            <div ref={mountRef} className="absolute inset-0 z-0" />

            {/* HTML Pin Overlays - Positioned relative to mountRef parent */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {ready && OFFICES.map(o => {
                const pos = pins.get(o.id);
                if (!pos || !pos.visible) return null;
                return (
                  <PinOverlay key={o.id} office={o}
                    x={pos.x} y={pos.y}
                    visible={true}
                    active={activeId === o.id}
                    hovered={hoveredId === o.id}
                    onEnter={() => setHoveredId(o.id)}
                    onLeave={() => setHoveredId(null)}
                    onClick={e => handlePinClick(o, e)}
                  />
                );
              })}

              {ready && activeOffice && (() => {
                const pos = pins.get(activeOffice.id);
                if (!pos) return null;
                return (
                  <OfficeCard office={activeOffice}
                    sx={pos.x}
                    sy={pos.y}
                    cw={dims.w} ch={dims.h}
                    onClose={handleClose} />
                );
              })()}
            </div>

            {/* Loading */}
            {!ready && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-300">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="font-medium">Initializing Globe...</span>
              </div>
            )}
          </div>

          {/* Office Locations — Compact Country Rows */}
          <div className="mt-8 animate-[fade-up_.6s_ease-out_.6s_both]">
            {(() => {
              const countryFlags: Record<string, string> = {
                "United States": images.flagUSA,
                "Canada": images.flagCanada,
                "Australia": images.flagAustralia,
                "United Kingdom": images.flagUK,
                "India": images.flagIndia,
                "UAE": images.flagUAE,
                "Portugal": images.flagPortugal,
              };
              const grouped = OFFICES.reduce<Record<string, Office[]>>((acc, o) => {
                if (!acc[o.country]) acc[o.country] = [];
                acc[o.country].push(o);
                return acc;
              }, {});
              return (
                <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  {Object.entries(grouped).map(([country, offices]) => (
                    <div key={country} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                      {/* Country Label */}
                      <div className="flex items-center gap-2 w-44 shrink-0">
                        {countryFlags[country] ? (
                          <img
                            src={countryFlags[country]}
                            alt={`${country} flag`}
                            className="w-[26px] h-4 object-cover rounded-xs border border-gray-100 shadow-xs"
                          />
                        ) : (
                          <span className="text-lg leading-none">🌐</span>
                        )}
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide truncate">{country}</span>
                      </div>
                      {/* Divider */}
                      <div className="w-px h-5 bg-gray-100 shrink-0" />
                      {/* City Pills */}
                      <div className="flex flex-wrap gap-2">
                        {offices.map(o => {
                          const isActive = activeId === o.id;
                          return (
                            <button
                              key={o.id}
                              onClick={() => { focusOffice(o); setActiveId(o.id); }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border transition-all duration-200 ${isActive
                                ? 'bg-[#14C1F4] border-[#14C1F4] text-white shadow-sm'
                                : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#14C1F4]'
                                }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-[#14C1F4]'}`} />
                              {o.city}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobePresence;