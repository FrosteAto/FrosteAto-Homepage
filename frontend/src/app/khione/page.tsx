import type { Metadata } from "next";
import BootWindow from "@/components/BootWindow";
import EditionInfographic from "@/components/EditionInfographic";
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
  { id: "ulw", name: "Ultra Lightweight", image: "/images/khione/ulw.png", accent: "green", role: "Ultra lightweight, build-it-yourself" },
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
      "archiso", "visual-studio-code-bin",
    ],
  },
  {
    category: "Gaming",
    items: [
      "steam", "gamescope", "unityhub", "adwsteamgtk", "proton-vpn-gtk-app", "protontricks",
      "prismlauncher",
    ],
  },
  {
    category: "Creative & media",
    items: [
      "krita", "godot", "obs-studio", "audacity", "elisa", "blender", "kdenlive", "libreoffice",
      "gwenview", "mpv", "darktable", "anki", "gimp", "inkscape", "hayase-desktop-bin",
    ],
  },
  {
    category: "Audio & music production",
    items: [
      "easyeffects", "calf", "carla", "lsp-plugins", "spicetify-cli", "wine", "wine-mono",
      "wine-gecko", "winetricks", "realtime-privileges", "lib32-pipewire", "lib32-libpulse",
      "lib32-alsa-lib", "lib32-alsa-plugins", "sof-firmware",
    ],
  },
  {
    category: "Graphics drivers",
    items: ["vulkan-radeon", "lib32-vulkan-radeon", "xf86-video-amdgpu"],
  },
  {
    category: "Printing, scanning & tablets",
    items: [
      "cups", "cups-pdf", "print-manager", "sane", "skanlite", "hplip", "libwacom",
      "xf86-input-wacom", "input-wacom-dkms-git",
    ],
  },
  {
    category: "Desktop polish & extras",
    items: [
      "kwin-effects-forceblur", "kwin-effect-rounded-corners-git", "kwin-scripts-krohnkite-git",
      "discord", "betterdiscord-installer-bin", "betterdiscordctl", "spotify", "konsave",
      "com.usebottles.bottles",
    ],
  },
  {
    category: "System utilities",
    items: [
      "ufw", "nano", "btop", "fastfetch", "flatpak", "kitty", "dolphin", "partitionmanager",
      "ark", "qbittorrent", "7zip", "curl", "unzip", "firefox",
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
      "partitionmanager", "7zip", "pacman-contrib", "python", "python-markdown", "python-pip",
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
      "partitionmanager", "7zip", "python", "python-markdown", "python-pip", "python-pipx",
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
    items: ["ufw", "nano", "btop", "flatpak", "kitty", "fastfetch", "firefox", "7zip"],
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
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 lg:px-12">
        <BootWindow
          tagline="A custom Arch Linux distro built around a practical, opinionated setup for desktop, server, and kiosk use, focused on ease of setup."
          githubHref="https://github.com/FrosteAto/Khione"
          editions={overview}
        />
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-4 py-10 sm:px-8 lg:px-12">
        <EditionInfographic
          edition={{
            id: "desktop",
            name: "Desktop",
            image: "/images/khione/desktop.png",
            accent: "purple",
            role: "Gaming + dev + creative",
            de: "KDE Plasma",
            terminal: "kitty",
            size: "~16.7 GB",
            packages: desktopPackages,
            intro: "Where it all began. After one too many rounds of distro-hopping and \
              reinstalling everything from scratch, I scripted my way to a distro with \
              EVERYTHING I need pre-installed - not a 'bloat is the enemy' minimal setup, \
              though it's still light and efficient.",
            topics: [
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
            ],
          }}
        />

        <hr className="my-16 border-2 border-dashed border-fg/20" />

        <EditionInfographic
          edition={{
            id: "server",
            name: "Server",
            image: "/images/khione/server.png",
            accent: "blue",
            role: "Self-hosted services",
            de: "KDE Plasma",
            terminal: "kitty",
            size: "~6.2 GB",
            packages: serverPackages,
            intro: "As the name implies, a server-focused edition. Using Arch Linux as a \
              server is somewhat unconventional, but if you know what you're doing, it \
              works just fine.",
            topics: [
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
            ],
          }}
        />

        <hr className="my-16 border-2 border-dashed border-fg/20" />

        <EditionInfographic
          edition={{
            id: "node",
            name: "Node",
            image: "/images/khione/node.png",
            accent: "yellow",
            role: "Always-on kiosk",
            de: "KDE Plasma",
            terminal: "kitty",
            size: "~5.6 GB",
            packages: nodePackages,
            intro: "Node is... minimal. Its entire job is to boot straight into a kiosk \
              pointed at the Server's dashboard - and it shares the same ufw firewall \
              baseline as the other editions. It's theme is pretty cute though.",
            topics: [
              {
                title: "Boot Sequence",
                body: "Boots into a KDE Plasma session and opens Firefox straight to the Glance dashboard hosted by Khione Server - no manual steps.",
              },
              {
                title: "Always On",
                body: "Sleep, suspend, and hibernate are all disabled while plugged in, so it stays reachable as an always-on appliance.",
              },
            ],
          }}
        />

        <hr className="my-16 border-2 border-dashed border-fg/20" />

        <EditionInfographic
          edition={{
            id: "ulw",
            name: "Ultra Lightweight",
            image: "/images/khione/ulw.png",
            accent: "green",
            role: "Ultra lightweight, build-it-yourself",
            de: "Xfce",
            terminal: "kitty",
            size: "~3.7 GB",
            packages: ulwPackages,
            intro: "Does what it says on the tin. It swaps KDE Plasma for Xfce and comes as \
              a pretty much blank slate - just the bare essentials like a file manager \
              and a browser, ready to be built up however you like.",
            topics: [
              {
                title: "Featherweight",
                body: `Xfce, picom, and a bare ${packageCount(ulwPackages)}-package base add up to a system that idles at under 1GB of RAM - plenty of headroom, or great for older systems.`,
              },
              {
                title: "Still the Khione Treatment",
                body: "Ultra Lightweight still has a colour-coded theme made to look as close to the KDE-based flavours as Xfce allows, keeping it both distinct and familiar.",
              },
              {
                title: "Build-It-Yourself",
                body: "Thunar and kitty sit on the panel and that's about it - the rest is left up to you, with yay on hand for pulling in whatever else you need from the AUR.",
              },
            ],
          }}
        />
      </div>
    </main>
  );
}
