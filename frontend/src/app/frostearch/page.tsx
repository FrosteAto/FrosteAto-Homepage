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
          setup for desktop, server, and kiosk use, focused on ease of setup.
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
            `FrosteArch Desktop is where it all began. When I first started using Linux, I did a bit of distro hopping.
            Eventually, I got sick of the whole 'reinstalling everything' malarkey, so I began making a script to install 
            the packages I want. Eventually, it became a distro that has EVERYTHING I could use my PC for. 
            This is no 'hyper lightweight, bloat is the enemy' system (Though it *is* light and efficient.)`,
            
            `For gaming, it comes with Steam pre-installed, along with wine and proton. AMD drivers are pre-installed, 
            so don't even think about worrying. Nowadays, what more do you need?`,
            
            `Coding is ready from first boot: Python, PHP with Composer, Node.js with npm, Docker and Docker Compose,
            Git, and VS Code, backed by build tooling like make and cmake.`,
            
            `On the creative side, Krita, Blender, Kdenlive, OBS Studio, Audacity, and Darktable cover illustration,
            3D, video editing, streaming, and photo work.`,
            
            `Music production gets special treatment too: a dedicated setup script configures a Wine prefix specifically
            for FL Studio and the Hatsune Miku V4X & Piapro Studio, sidestepping what is historically one of the 
            most painful things to get working on Linux.`,
             
            `Underneath all of that sits ordinary desktop polish - KDE Plasma that is highly customised with multiple
            themes and preset widgets, printing and scanning supportvia CUPS and SANE, and Wacom tablet drivers configured 
            out of the box.`,
          ]}
        />
        <FlavourSection
          id="server"
          name="Server Edition"
          packages={serverPackages}
          paragraphs={[
            `FrosteArch Server, as the name implies, is a server-focused edition. I am aware using Arch Linux as a
             server is somewhat unconventional, but if you know what you're doing, it works just fine.`,
            `It keeps enough local tooling to allow localised debugging: a terminal, a file manager, a text editor, but also
            keeps SSH open for standard remote access.`,
            `Security's handled automatically too - ufw is enabled out of the box with only the ports each running
            service actually needs left open, rather than everything wide open until someone remembers to lock it
            down.`,
            `Plex Media Server is installed and enabled from first boot, so once you point it at a library it's
            straight into transcoding and streaming - no extra setup required.`,
            `For network storage, Samba handles file sharing, with wsdd making the server show up properly in Windows'
            Network browser. Cockpit sits alongside it as a proper web GUI for managing shares, disks, and RAID
            arrays, backed by smartmontools keeping an eye on disk health in the background.`,
            `Glance ties it all together as a self-hosted dashboard on port 8080 - weather, news, and server stats,
            sure, but also a genuinely custom-built finances page with bank sync, budget tracking, and
            recurring-payment detection, plus meal-planning widgets with their own recipe rotation. All of it's
            driven by small systemd-timer helper scripts running quietly in the background.`,
            `Home Assistant runs containerised on port 8123 for smart-home control, with support for a Zigbee
            coordinator dongle if you plug one in. Its data lives outside the container, so it survives reinstalls,
            and updating it is just a docker pull and a restart.`,
          ]}
        />
        <FlavourSection
          id="node"
          name="Node Edition"
          packages={nodePackages}
          paragraphs={[
            `FrosteArch Node is... minimal. Its entire job is to boot, log into a KDE Plasma
            session, and open Firefox to the Glance dashboard hosted by FrosteArch Server. Sleep, suspend, and hibernate are disabled when plugged in, so it
            stays reachable as an always-on appliance, and it shares the same ufw firewall baseline as the other
            editions.`,

            `It's theme is pretty cute though.`,
          ]}
        />
      </div>
    </main>
  );
}
