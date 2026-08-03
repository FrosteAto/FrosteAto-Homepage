import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FlavourSection from "@/components/FlavourSection";

export const metadata: Metadata = {
  title: "FrosteArch | FrosteAto",
};

const flavours = [
  {
    name: "Desktop Edition",
    image: "/images/frostearch/desktop.png",
    description:
      "A full daily-driver environment with programming, productivity, gaming, and creative tools already installed.",
    features: [
      {
        title: "Coding",
        description:
          "Python, PHP + Composer, Node.js + npm, Docker + Docker Compose, Git, and VS Code, plus build tooling (make, cmake) - ready the moment you log in.",
      },
      {
        title: "Gaming",
        description:
          "Steam with Proton, Gamescope, and a Proton VPN client, backed by AMD Vulkan drivers installed out of the box.",
      },
      {
        title: "Creative tools",
        description:
          "Krita, Blender, Kdenlive, OBS Studio, Audacity, and Darktable cover art, video editing, streaming, and photo work.",
      },
      {
        title: "Music production",
        description:
          "A dedicated script sets up a Wine prefix for FL Studio and the Hatsune Miku Piapro Studio voicebank suite - historically one of the most painful things to get working on Linux.",
      },
      {
        title: "Everyday use",
        description:
          "KDE Plasma, printing and scanning out of the box (CUPS, SANE), and Wacom tablet support pre-configured.",
      },
    ],
    packages: {
      official: [
        "xorg", "plasma", "plasma-workspace", "greetd", "greetd-tuigreet", "kwallet", "kwallet-pam",
        "libsecret", "kdialog", "ufw", "nano", "btop", "fastfetch", "flatpak", "kitty", "dolphin",
        "firefox", "steam", "krita", "godot", "obs-studio", "audacity", "blender", "kdenlive",
        "libreoffice", "gwenview", "mpv", "easyeffects", "calf", "darktable", "anki", "python",
        "python-markdown", "python-pip", "python-pipx", "python-virtualenv", "php", "composer",
        "nodejs", "npm", "docker", "docker-compose", "make", "cmake", "git", "archiso",
        "partitionmanager", "cups", "cups-pdf", "print-manager", "sane", "skanlite", "hplip",
        "avahi", "nss-mdns", "libinput", "libwacom", "wacomtablet", "xf86-input-wacom",
        "noto-fonts", "noto-fonts-cjk", "noto-fonts-emoji", "ttf-dejavu", "ttf-jetbrains-mono",
        "sof-firmware", "wine", "wine-mono", "wine-gecko", "winetricks", "p7zip",
        "realtime-privileges", "lib32-pipewire", "lib32-libpulse", "lib32-alsa-lib",
        "lib32-alsa-plugins", "vulkan-radeon", "lib32-vulkan-radeon",
      ],
      aur: [
        "discord", "spotify", "visual-studio-code-bin", "gamescope", "unityhub", "adwsteamgtk",
        "proton-vpn-gtk-app", "kwin-effects-forceblur", "kwin-effect-rounded-corners-git",
        "kwin-scripts-krohnkite-git", "lsp-plugins", "hayase-desktop-bin", "input-wacom-dkms-git",
      ],
      flatpak: ["com.usebottles.bottles"],
    },
  },
  {
    name: "Server Edition",
    image: "/images/frostearch/server.png",
    description:
      "A lean profile tuned for long-running services, including Plex defaults and enough local tooling to debug directly on the machine.",
    features: [
      {
        title: "Automatic firewall",
        description:
          "ufw is enabled by default with only the ports each service actually needs opened - locked down out of the box, not an afterthought.",
      },
      {
        title: "Plex Media Server",
        description: "Installed and enabled, ready to point at your media library.",
      },
      {
        title: "NAS via Cockpit",
        description:
          "Samba file sharing (visible to Windows via wsdd), a Cockpit web GUI for managing shares and disks/RAID, and smartmontools for disk health monitoring.",
      },
      {
        title: "Home Assistant",
        description:
          "Runs containerized with Zigbee coordinator dongle support, and persists across reinstalls.",
      },
      {
        title: "Glance dashboard",
        description:
          "A self-hosted home dashboard on port 8080 - weather, news, server stats, and Home Assistant status, plus a genuinely custom-built finances page (bank sync, budget tracking, recurring payments) and meal-planning widgets, backed by small systemd-timer helper scripts.",
      },
    ],
    packages: {
      official: [
        "linux-lts", "linux-lts-headers", "linux-firmware", "xorg", "plasma", "plasma-workspace",
        "greetd", "greetd-tuigreet", "kwallet", "kwallet-pam", "libsecret", "kdialog", "ufw",
        "nano", "btop", "flatpak", "kitty", "dolphin", "ark", "fastfetch", "firefox", "sof-firmware",
        "git", "partitionmanager", "p7zip", "python", "python-markdown", "python-pip",
        "python-pipx", "openssh", "avahi", "nss-mdns", "noto-fonts", "noto-fonts-cjk",
        "noto-fonts-emoji", "ttf-dejavu", "ttf-jetbrains-mono", "samba", "cockpit",
        "smartmontools", "pacman-contrib", "docker",
      ],
      aur: [
        "plex-media-server", "wsdd", "cockpit-file-sharing", "cockpit-storaged", "glance-bin",
        "librespeed-cli-bin",
      ],
    },
  },
  {
    name: "Node Edition",
    image: "/images/frostearch/node.png",
    description:
      "A minimal profile whose only job is to boot, log in, and show a dashboard in Firefox.",
    features: [
      {
        title: "Minimal by design",
        description:
          "Just enough to boot, log in, and open Firefox to your dashboard - nothing else.",
      },
      {
        title: "Always-on appliance",
        description:
          "Sleep, suspend, and hibernate are disabled so it stays reachable, with the same ufw firewall baseline as the other editions.",
      },
      {
        title: "No AUR or Flatpak bloat",
        description: "Deliberately the leanest of the three editions.",
      },
    ],
    packages: {
      official: [
        "linux-lts", "linux-lts-headers", "linux-firmware", "xorg", "plasma", "plasma-workspace",
        "greetd", "greetd-tuigreet", "kwallet", "kwallet-pam", "libsecret", "kdialog", "ufw",
        "nano", "btop", "flatpak", "kitty", "dolphin", "fastfetch", "firefox", "sof-firmware",
        "git", "partitionmanager", "p7zip", "python", "python-markdown", "python-pip",
        "python-pipx", "avahi", "nss-mdns", "noto-fonts", "noto-fonts-cjk", "noto-fonts-emoji",
        "ttf-dejavu", "ttf-jetbrains-mono",
      ],
    },
  },
];

export default function FrosteArchPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
        <Image
          src="/images/frostearch/logo.png"
          alt="FrosteArch"
          width={520}
          height={134}
          priority
          className="h-auto w-full max-w-md"
        />
        <p className="max-w-2xl text-lg leading-relaxed text-ink/80">
          A custom Arch Linux distro built around a practical, opinionated
          setup for desktop, server, and appliance use. Three editions, one
          install flow.
        </p>
        <Link
          href="https://github.com/FrosteAto/FrosteArch"
          className="text-link"
        >
          View the source and installation guide on GitHub
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {flavours.map((flavour, i) => (
          <FlavourSection key={flavour.name} index={i} {...flavour} />
        ))}
      </div>
    </main>
  );
}
