import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FlavourSection from "@/components/FlavourSection";
import type { PackageGroup } from "@/components/PackageList";

export const metadata: Metadata = {
  title: "FrosteArch | Daniel O'Brien",
};

const overview = [
  { id: "desktop", name: "Desktop", image: "/images/frostearch/desktop.png" },
  { id: "server", name: "Server", image: "/images/frostearch/server.png" },
  { id: "node", name: "Node", image: "/images/frostearch/node.png" },
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

export default function FrosteArchPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
        <Image
          src="/images/frostearch/logo.png"
          alt="FrosteArch"
          width={420}
          height={108}
          priority
          className="h-auto w-full max-w-sm"
        />
        <p className="max-w-xl text-lg leading-relaxed text-ink/80">
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

      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 lg:gap-10">
          {overview.map((edition) => (
            <a
              key={edition.id}
              href={`#${edition.id}`}
              aria-label={`${edition.name} edition`}
              className="group relative block overflow-hidden rounded-2xl border border-light-brown/40 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-dark-green/50 hover:shadow-xl"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={edition.image}
                  alt={`${edition.name} edition`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <p className="absolute bottom-5 left-5 font-[family-name:var(--font-heading)] text-3xl text-white drop-shadow-md">
                  {edition.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col divide-y divide-light-brown/30">
        <FlavourSection
          id="desktop"
          name="Desktop Edition"
          packages={desktopPackages}
          paragraphs={[
            `FrosteArch Desktop is built to be a genuine daily driver, not a base install with a few extras bolted on.
            Coding is ready from first boot: Python, PHP with Composer, Node.js with npm, Docker and Docker Compose,
            Git, and VS Code, backed by build tooling like make and cmake. For gaming, Steam ships with Proton
            pre-configured, alongside Gamescope, a Proton VPN client, and AMD Vulkan drivers already installed - no
            fighting with drivers before a single game launches.`,
            `On the creative side, Krita, Blender, Kdenlive, OBS Studio, Audacity, and Darktable cover illustration,
            3D, video editing, streaming, and photo work. Music production gets special treatment too: a dedicated
            setup script configures a Wine prefix specifically for FL Studio and the Hatsune Miku Piapro Studio
            voicebank suite, sidestepping what is historically one of the most painful things to get working on
            Linux. Underneath all of that sits ordinary desktop polish - KDE Plasma, printing and scanning support
            via CUPS and SANE, and Wacom tablet drivers configured out of the box.`,
          ]}
        />
        <FlavourSection
          id="server"
          name="Server Edition"
          packages={serverPackages}
          paragraphs={[
            `FrosteArch Server trades desktop software for a tuned set of long-running services, but keeps enough
            local tooling - a terminal, a file manager, a text editor - to debug directly on the machine rather than
            needing to SSH in for every little thing. Security starts with an automatic firewall: ufw is enabled by
            default with only the ports each running service actually needs left open, rather than everything wide
            open until someone remembers to lock it down. Plex Media Server is installed and enabled out of the box,
            ready to point at a media library.`,
            `For network storage, Samba handles file sharing - with wsdd making the server show up properly in
            Windows' Network browser - and Cockpit provides a web GUI for managing shares, disks, and RAID arrays,
            backed by smartmontools for ongoing disk health monitoring. Home Assistant runs containerized with
            support for a Zigbee coordinator dongle, and its data survives reinstalls. Tying it together is Glance, a
            self-hosted dashboard on port 8080 showing weather, news, and server stats - plus, going well beyond the
            usual dashboard fare, a genuinely custom-built finances page with bank sync, budget tracking, and
            recurring-payment detection, and meal-planning widgets, all driven by small systemd-timer helper scripts
            running quietly in the background.`,
          ]}
        />
        <FlavourSection
          id="node"
          name="Node Edition"
          packages={nodePackages}
          paragraphs={[
            `FrosteArch Node is the deliberately boring one. Its entire job is to boot, log into a minimal KDE Plasma
            session, and open Firefox to a dashboard - nothing more. Sleep, suspend, and hibernate are disabled so it
            stays reachable as an always-on appliance, and it shares the same ufw firewall baseline as the other
            editions.`,
            `There's no AUR or Flatpak software layered on top, and the package list is honestly small - Node is meant
            to disappear into the background, not to be tinkered with.`,
          ]}
        />
      </div>
    </main>
  );
}
