import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FlavourSection from "@/components/FlavourSection";
import { accentText } from "@/lib/khioneAccent";
import type { Accent } from "@/lib/khioneAccent";
import type { PackageGroup } from "@/components/PackageList";

const packageCount = (groups: PackageGroup[]) =>
  groups.reduce((sum, g) => sum + g.items.length, 0);

export const metadata: Metadata = {
  title: "Khione | FrosteAto",
};

const overview: {
  id: string;
  name: string;
  image: string;
  accent: Accent;
  role: string;
}[] = [
  { id: "desktop", name: "Desktop", image: "/images/khione/desktop.png", accent: "purple", role: "Gaming + dev + creative" },
  { id: "server", name: "Server", image: "/images/khione/server.png", accent: "blue", role: "Self-hosted services" },
  { id: "node", name: "Node", image: "/images/khione/node.png", accent: "yellow", role: "Always-on kiosk" },
  { id: "ulw", name: "ULW", image: "/images/khione/ulw.png", accent: "green", role: "Ultra lightweight, build-it-yourself" },
];

const desktopPackages: PackageGroup[] = [
  {
    category: "Desktop environment & login",
    items: [
      "xorg", "plasma", "plasma-workspace", "greetd", "greetd-tuigreet", "kwallet",
      "kwallet-pam", "libsecret", "kdialog", "libinput",
    ],
  },
  {
    category: "Development",
    items: [
      "python", "python-markdown", "python-pip", "python-pipx", "python-virtualenv", "php",
      "composer", "nodejs", "npm", "docker", "docker-compose", "make", "cmake", "git",
      "visual-studio-code-bin",
    ],
  },
  {
    category: "Gaming",
    items: ["steam", "gamescope", "unityhub", "adwsteamgtk", "proton-vpn-gtk-app"],
  },
  {
    category: "Creative & media",
    items: [
      "krita", "godot", "obs-studio", "audacity", "blender", "kdenlive", "libreoffice",
      "gwenview", "mpv", "darktable", "anki",
    ],
  },
  {
    category: "Audio & music production",
    items: [
      "easyeffects", "calf", "wine", "wine-mono", "wine-gecko", "winetricks",
      "realtime-privileges", "lib32-pipewire", "lib32-libpulse", "lib32-alsa-lib",
      "lib32-alsa-plugins", "sof-firmware",
    ],
  },
  {
    category: "Graphics drivers",
    items: ["vulkan-radeon", "lib32-vulkan-radeon"],
  },
  {
    category: "Printing, scanning & tablets",
    items: [
      "cups", "cups-pdf", "print-manager", "sane", "skanlite", "hplip", "libwacom",
      "wacomtablet", "xf86-input-wacom", "input-wacom-dkms-git",
    ],
  },
  {
    category: "Desktop polish & extras",
    items: [
      "kwin-effects-forceblur", "kwin-effect-rounded-corners-git", "kwin-scripts-krohnkite-git",
      "lsp-plugins", "hayase-desktop-bin", "discord", "spotify", "com.usebottles.bottles",
    ],
  },
  {
    category: "System utilities",
    items: [
      "ufw", "nano", "btop", "fastfetch", "flatpak", "kitty", "dolphin", "partitionmanager",
      "archiso", "p7zip",
    ],
  },
  {
    category: "Fonts & networking",
    items: [
      "noto-fonts", "noto-fonts-cjk", "noto-fonts-emoji", "ttf-dejavu", "ttf-jetbrains-mono",
      "avahi", "nss-mdns",
    ],
  },
];

const serverPackages: PackageGroup[] = [
  {
    category: "Desktop environment & login",
    items: [
      "xorg", "plasma", "plasma-workspace", "greetd", "greetd-tuigreet", "kwallet",
      "kwallet-pam", "libsecret", "kdialog",
    ],
  },
  { category: "Media server", items: ["plex-media-server"] },
  {
    category: "NAS & file sharing",
    items: ["samba", "cockpit", "cockpit-file-sharing", "cockpit-storaged", "wsdd", "smartmontools"],
  },
  {
    category: "Home automation",
    items: ["docker"],
  },
  { category: "Dashboard", items: ["glance-bin", "librespeed-cli-bin"] },
  {
    category: "Networking & firewall",
    items: ["ufw", "openssh", "avahi", "nss-mdns"],
  },
  {
    category: "System utilities",
    items: [
      "nano", "btop", "flatpak", "kitty", "dolphin", "ark", "fastfetch", "firefox", "git",
      "partitionmanager", "p7zip", "pacman-contrib", "python", "python-markdown", "python-pip",
      "python-pipx",
    ],
  },
  {
    category: "Base system & fonts",
    items: [
      "linux-lts", "linux-lts-headers", "linux-firmware", "sof-firmware", "noto-fonts",
      "noto-fonts-cjk", "noto-fonts-emoji", "ttf-dejavu", "ttf-jetbrains-mono",
    ],
  },
];

const nodePackages: PackageGroup[] = [
  {
    category: "Desktop environment & login",
    items: [
      "xorg", "plasma", "plasma-workspace", "greetd", "greetd-tuigreet", "kwallet",
      "kwallet-pam", "libsecret", "kdialog",
    ],
  },
  {
    category: "System utilities",
    items: [
      "nano", "btop", "flatpak", "kitty", "dolphin", "fastfetch", "firefox", "git",
      "partitionmanager", "p7zip", "python", "python-markdown", "python-pip", "python-pipx",
    ],
  },
  {
    category: "Base system & fonts",
    items: [
      "linux-lts", "linux-lts-headers", "linux-firmware", "sof-firmware", "noto-fonts",
      "noto-fonts-cjk", "noto-fonts-emoji", "ttf-dejavu", "ttf-jetbrains-mono",
    ],
  },
  { category: "Networking & firewall", items: ["ufw", "avahi", "nss-mdns"] },
];

const ulwPackages: PackageGroup[] = [
  {
    category: "Desktop environment & login",
    items: [
      "xorg", "xfce4", "greetd", "greetd-tuigreet", "gnome-keyring", "libsecret", "zenity",
      "picom", "adw-gtk-theme",
    ],
  },
  {
    category: "File management",
    items: ["thunar", "thunar-archive-plugin", "file-roller", "gvfs-smb", "smbclient", "gparted"],
  },
  {
    category: "Development",
    items: ["python", "python-markdown", "python-pip", "python-pipx", "git", "geany"],
  },
  {
    category: "System utilities",
    items: ["ufw", "nano", "btop", "flatpak", "kitty", "fastfetch", "firefox", "p7zip"],
  },
  {
    category: "Audio & media",
    items: ["playerctl", "pipewire-pulse", "wireplumber", "xfce4-pulseaudio-plugin"],
  },
  {
    category: "Panel & polish",
    items: [
      "xfce4-docklike-plugin", "xfce4-weather-plugin", "xfce4-genmon-plugin",
      "xfce4-screenshooter", "xfce4-taskmanager", "network-manager-applet",
    ],
  },
  {
    category: "Fonts & networking",
    items: [
      "noto-fonts", "noto-fonts-cjk", "noto-fonts-emoji", "ttf-dejavu", "ttf-jetbrains-mono",
      "ttf-jetbrains-mono-nerd", "avahi", "nss-mdns",
    ],
  },
  {
    category: "Base system",
    items: ["sof-firmware"],
  },
];

export default function KhionePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
        <Image
          src="/images/khione/logo.png"
          alt="Khione"
          width={4167}
          height={4167}
          priority
          className="h-auto w-full max-w-sm"
        />
        <p className="max-w-xl text-lg leading-relaxed text-fg/80">
          A custom Arch Linux distro built around a practical, opinionated
          setup for desktop, server, and kiosk use, focused on ease of setup.
        </p>
        <Link
          href="https://github.com/FrosteAto/Khione"
          className="text-link"
        >
          View the source and installation guide on GitHub
        </Link>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-md border border-fg/12 bg-card-bg">
          <p className="border-b border-fg/12 px-5 py-3 font-[family-name:var(--font-plex-mono)] text-xs text-fg/40">
            frosteato@khione ~ $ ./boot-menu --list
          </p>
          <div className="flex flex-col divide-y divide-fg/10">
            {overview.map((edition) => (
              <a
                key={edition.id}
                href={`#${edition.id}`}
                aria-label={`Jump to ${edition.name} edition`}
                className="group flex items-center gap-4 px-4 py-4 transition-colors duration-200 hover:bg-fg/5 sm:gap-5 sm:px-6"
              >
                <span
                  className={`w-3 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${accentText[edition.accent]}`}
                  aria-hidden
                >
                  &gt;
                </span>
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full sm:h-10 sm:w-10">
                  <Image
                    src={edition.image}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover object-left"
                  />
                </div>
                <span className="flex-1 font-[family-name:var(--font-jetbrains-mono)] text-lg sm:text-xl">
                  Khione {edition.name}
                </span>
                <span className="hidden font-[family-name:var(--font-plex-mono)] text-xs text-fg/50 sm:block">
                  {edition.role}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col divide-y divide-fg/10">
        <FlavourSection
          id="desktop"
          name="Desktop Edition"
          host="khione-desktop"
          accent="purple"
          specs={[
            { label: "Role", value: "Gaming + dev + creative" },
            { label: "DE", value: "KDE Plasma" },
            { label: "Terminal", value: "kitty" },
            { label: "Est. Size", value: "~5.4 GB" },
            { label: "Packages", value: `${packageCount(desktopPackages)} (pacman)` },
          ]}
          packages={desktopPackages}
          intro="Where it all began. After one too many rounds of distro-hopping and
            reinstalling everything from scratch, I scripted my way to a distro with
            EVERYTHING I need pre-installed - not a 'bloat is the enemy' minimal setup,
            though it's still light and efficient."
          topics={[
            {
              title: "Gaming",
              body: "Steam, Wine, and Proton pre-installed, AMD drivers ready to go. Nowadays, what more do you need?",
            },
            {
              title: "Development",
              body: "Python, PHP with Composer, Node.js with npm, Docker and Docker Compose, Git, and VS Code - ready from first boot, backed by make and cmake.",
            },
            {
              title: "Creative & Media",
              body: "Krita, Blender, Kdenlive, OBS Studio, Audacity, and Darktable cover illustration, 3D, video editing, streaming, and photo work.",
            },
            {
              title: "Music Production",
              body: "A dedicated setup script configures a Wine prefix specifically for FL Studio and Hatsune Miku V4X & Piapro Studio - sidestepping one of the most painful things to get working on Linux.",
            },
            {
              title: "Desktop Polish",
              body: "KDE Plasma, heavily customised with multiple themes and preset widgets, plus printing and scanning via CUPS and SANE, and Wacom tablet drivers out of the box.",
            },
          ]}
        />
        <FlavourSection
          id="server"
          name="Server Edition"
          host="khione-server"
          accent="blue"
          specs={[
            { label: "Role", value: "Self-hosted services" },
            { label: "DE", value: "KDE Plasma" },
            { label: "Terminal", value: "kitty" },
            { label: "Est. Size", value: "~1.9 GB" },
            { label: "Packages", value: `${packageCount(serverPackages)} (pacman)` },
          ]}
          packages={serverPackages}
          intro="As the name implies, a server-focused edition. Using Arch Linux as a
            server is somewhat unconventional, but if you know what you're doing, it
            works just fine."
          topics={[
            {
              title: "Media",
              body: "Plex Media Server is installed and enabled from first boot - point it at a library and it's straight into transcoding and streaming.",
            },
            {
              title: "File Sharing",
              body: "Samba handles file sharing, with wsdd making the server show up properly in Windows' Network browser. Cockpit adds a web GUI for shares, disks, and RAID arrays, with smartmontools watching disk health.",
            },
            {
              title: "Dashboard",
              body: "Glance runs on :8080 - weather, news, and server stats, but also a genuinely custom-built finances page with bank sync and budget tracking, plus meal-planning widgets, all driven by small systemd-timer scripts.",
            },
            {
              title: "Smart Home",
              body: "Home Assistant runs containerised on :8123 for smart-home control, with support for a Zigbee coordinator dongle. Its data lives outside the container, so it survives reinstalls.",
            },
            {
              title: "Remote Access",
              body: "Enough local tooling for hands-on debugging - terminal, file manager, text editor - plus SSH open for standard remote access, with ufw locked to only the ports each service actually needs.",
            },
          ]}
        />
        <FlavourSection
          id="node"
          name="Node Edition"
          host="khione-node"
          accent="yellow"
          specs={[
            { label: "Role", value: "Always-on kiosk" },
            { label: "DE", value: "KDE Plasma" },
            { label: "Terminal", value: "kitty" },
            { label: "Est. Size", value: "~1.5 GB" },
            { label: "Packages", value: `${packageCount(nodePackages)} (pacman)` },
          ]}
          packages={nodePackages}
          intro="Node is... minimal. Its entire job is to boot straight into a kiosk
            pointed at the Server's dashboard - and it shares the same ufw firewall
            baseline as the other editions. It's theme is pretty cute though."
          topics={[
            {
              title: "Boot Sequence",
              body: "Boots into a KDE Plasma session and opens Firefox straight to the Glance dashboard hosted by Khione Server - no manual steps.",
            },
            {
              title: "Always On",
              body: "Sleep, suspend, and hibernate are all disabled while plugged in, so it stays reachable as an always-on appliance.",
            },
          ]}
        />
        <FlavourSection
          id="ulw"
          name="ULW Edition"
          host="khione-ulw"
          accent="green"
          specs={[
            { label: "Role", value: "Ultra lightweight, build-it-yourself" },
            { label: "DE", value: "Xfce" },
            { label: "Terminal", value: "kitty" },
            { label: "Est. Size", value: "TBD" },
            { label: "Packages", value: `${packageCount(ulwPackages)} (pacman)` },
          ]}
          packages={ulwPackages}
          intro="ULW means Ultra LightWeight. It swaps KDE Plasma for Xfce and comes as
            a pretty much blank slate - just the bare essentials like a file manager
            and a browser, ready to be built up however you like."
          topics={[
            {
              title: "Featherweight",
              body: `Xfce, picom, and a bare ${packageCount(ulwPackages)}-package base add up to a system that idles at under 1GB of RAM - plenty of headroom, or great for older systems.`,
            },
            {
              title: "Still the Khione Treatment",
              body: "ULW still has a colour-coded theme made to look as close to the KDE-based flavours as Xfce allows, keeping it both distinct and familiar.",
            },
            {
              title: "Build-It-Yourself",
              body: "Thunar and kitty sit on the panel and that's about it - the rest is left up to you, with yay on hand for pulling in whatever else you need from the AUR.",
            },
          ]}
        />
      </div>
    </main>
  );
}
