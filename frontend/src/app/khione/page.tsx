import type { Metadata } from "next";
import BootWindow from "@/components/BootWindow";
import EditionInfographic from "@/components/EditionInfographic";
import type { Accent } from "@/lib/khioneAccent";
import type { PackageGroup } from "@/components/PackageList";

const packageCount = (groups: PackageGroup[]) =>
  groups.reduce((sum, g) => sum + g.items.length, 0);

const desktopBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADTElEQVR42n2TT2yTdRjHv8/v9657+291XVdWOgcrunSMhQMESGaYg0gGUQaJL46DziU4E9QQEy/qYXLRi8ZgIgcjIcQI0upUSLxoljQQXAYH2MYGOLaM0Ym0bl3bt9vb9v09HsjM5sHv7fk+3+Q5PN8PsEqGEZNYIyZmptVOLLY28++yv5/FyZOkug+eX5/OB49u2TS3x+cxN9y8G0JdrZXMZPWrg7/cvpCyPphkZiIiBgC5cvn06S2qq/O7494qZ3x7y3xX1nQ+27Z1OuhxU7DaY276az7c0dvX8kZjwyF54KWmRH9/v0gkEpCGEZPx+BH7+LFLH9fWBj5JJnPODetmy+++NsjprB/7dw7xlbFW9fZ77arzQKRyPiU7lrI7Gs+cO/GjYcSkHB+P83M7vjbeObHni1d7mkrPRP10c0TJbZHrYjb1FOULbtr5wmERbakXc1N5drm5NDZmbmtu6spd/MG4Rn19l1x/z5mj73+4t7G+zs2B9U5RtG1MTz6Cr6oEhyuMQMABpRh2kXHndoo/+3SIi1YpB71is1ZcLHcKURnJ503l0H3ChoLTqWFza/3qb4AIqNAFgmE3ORxQytZ9qmwdFTajnRXx6OhjdnklNE2AGVC2QtGyoRTDWlIQgkAE1IU8CD/tg2WVmIjahVIqJCVRMpmFwyWeBAEIKQDGk1kAA/EJpNMFAMDrx7ZSpS7JLqt1AoS8UsxV3koQEeyyAgi4dvUBTn0+hMk/5nElMYPh3x9i4lYamXQRGxursfv5jbyYWTY1Tcghi9G7qy0MZgYIyC2UIGyJhgYfAgEXampc2LsvgvSfy7DLCoVCiaenFkWFQw5rmsf5vcotfFTj94WIqCwEtPxiEZGIH7vaw2uKHQjpsMvK/vLUDRodebgciXjPEAAc2n/hxVDIf7n7lVa07Q6VpQ4oBSoVywQQWDFYMT9+ZPK334xrI7cWoOulN89dPPyVNIyYHPi5+261t2N44k5m+8z0UrBUEMKjO4XLKYmUIMsUVMhKMTNjil9/u5csWoW3zg+8fNYwYpJWWIjHj9g9PWf1B5PaweZoYF9ztCZaF3b7SUDkssVMcta8N3U/M3g/mfopkejNrMD3PyhjBTbtv+bq7D+9wHtyHvTyuQAAAABJRU5ErkJggg==";
const serverBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADG0lEQVR42mVTz2tcZRQ99/vm15sZ0yTWyY/a1JaKbRSLGBAUjVIQJfgLmlpxIUUiKl35BxhRqAuR7NxJ0EUrQ8Q2qBvDmGpaY0KomsZaq6TpzKSTlkxn8ubNvHnvfe+4aKa2enaHey8Hzj0HuBVZagBQLU4KSWlRDWCYN3ZauDkcJdX7ImHixEpvI9p3aE98aX+vKu/IOf3YlrCL18I7ZryLpeM48sBfIAUi/J8yviq83T61tr5//hzvOXWZR+fH+eLpHzl05gfGThm+vmTXd09ffRcARkepQAqGN493T60evXfeJSZLfOG7k/7K4mvB+MKYKfx6yDyZWwhOr3u+ZwzfWiExcekz3RLWAHDs0oFP1skrbuBNFBtmYDrP3xde5djPH/PY3AecWVslSU4VquHxyxtN60yTiW8K7wCA9EwWk2s0i58/0r2zO2jw4a1JpbXG2es2MpEGrEQX7rYAkqg0DXJX63zzgst607NVPOyP1KPhMxBrV81phG1tERWLaCS14Im72gC03bTJQNAR19jXaYlFO3SS6S3KdV5RoAyGovlTxWdfKoq4EhBAEBK2bxASuO4ZaAG0CO5LR7EnHYXnGwpkUBmwW4TyhxOgy4pCbz42ogSGgBIgpgQfXtxAwTUAgLH72yWtKD7DLqUAhwS3xhQIwCchAL680sDIbxXMVzx8sdrAyZKLyWIN56tNPLglhpe3p9hsho7SwKwAcqDHQisZyzUP5YaPvekItlsaz2YSmH08g8c642gaYiMI+YsditYyF+lRnKi6znt3ptt7FBAokUixHqA/rTGSSd2W9H0dCbhBaA6fs2WhaLu7UvIpBEDs6/xQ73SZHy03WKq5PknfkIHtGbPhBabs+qbkNIOZNcd/arZM5Gx2fJt/40Y/slkdvvToBXtoZG66JgNzzVim4CsVhFBWVEmdSvKekr8Drc6bqMquOkVUq0fs53eMI8tNz7NZLQcPmr7vlxMrTuq5bUl5eiAlex/qiHZGIarkhZUlh38u2l7uWr5+Aod3VkAqiIS3FCp7e5UBAMMaGIzgv8j+W+l/AF55oe+CpTOOAAAAAElFTkSuQmCC";
const nodeBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADEUlEQVR42m2T3YuUdRTHv+f8nmfmYWZ2ZnXfzFWcDbHaLgKxqJQUqS0S62oX8Q/oSgPB+1W7KCLoPgrLQmMQyjdkWYogrGzNrF1jVVZtt3Vwd9aZnZlnnrff73e6WHZronN3Dt8v54XzAf4VUoJqy4ehREb5n4qClIbbNLQmllEmOm4rpfX9KjEHVbawV1RqS9yoSsrLlMlG39cnF85sOo7bIiAQQIDQamcagamcSh9K57reyXXlOxO/BafQBR1EUAiBsAW9cSQMy1feL+z7ZVRGwTgGWRvp0fnt78l3O6TyRUaq54uJ/v11Hfz8htG/DZnqpWd0tHg9MXFNZPqILHyW+hzg1ZUZCx/xiJQ/Ee3PxcHsBVO9vEv0xAsSXHlJwh92SfzgsoiI1GdO2+adTyMZ65fFMz1HAYDKp/qyykkm1+38sOjHSrL9e1m5eeilCbDrAV4RKrMBsBo6fIhwflzMzROSRM0mcXrQcTPOax7igdD3rZsfYOUWQE4Gbt8etAUxlNcLr+9Fqk2lbc5r5puxPcgi2M2IxdZuiFt4EqTSAASwCWxUBcTChAsAMYhdOPltcArbYJJACNjNbO0GIYdMYwZurgiQAkQAciCiAWKwyqA19QFsUAYAZLe/S6I6CCbpZTA3SYxwunvFaBOAGPFfl+BfOwq9dB3R7FeIH4yhdfdLRJUJuJ2D8AZGxIRLLQa5PwFCqc1vrnwGgLh2E1FjBir/BDi7CamNL6NzaBxOz3MQE8ImTcHyr0RO+qqjbOasn/Cx7lzhMYA0sevoxj1wx+PIbt7fdkevdyesbpnw2mEK5n4M051PfwwAeHS6Y1/r4laJ/zghQe1WYsQkIqJNXDc6rJqktWii+n3tz48njW9fFf11TpbOFt8CAFUqQe04EN96+xX/KtdvPJv2J3pV6zZLUmF2HGKzTBxMkwom2U1mOZkbm19u6EM9B8onpQS1woKAiWDvndzidaf+3G9zW4ckN/iU2/P8emKXED2smeWpO9SY/mbx7v1zA0dQW/X8D8prgGIYUCW0I/5f7P8G7TuWdpFne6EAAAAASUVORK5CYII=";
const ulwBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADO0lEQVR42n2TXWhbZRjH/+/7npOTk7TJMrtmSdM5I6Z2VTs23IYfdaMUBirsK0LFKxHmlV4IG8gwBpw386qI4KVjoKS26y66tm422y60dXGVsXZNi9bapku6mTZfJ1/nvI8XFbeC+rv5w8Pz/G8efsCjEFg4BoH/gIEhHAuLzbO/iUTAo1FIAPCP7Gzbrzu7Q8Le8aNRVFWF32u0OSeGzibGMYpqhMCjbGN3oyACjihkz0CwmXsc53xC9KZVUz3S4MZE2UDQpmFkLYVnnJ3J9WLho/7uG7FwLCz63+i3RITArx+CfOFy65N6gyOeV/KHgqZNvOv0m83kkK9rHjmZXZVdLe/Rmec+2XZfLIVXXrnDxk/ciodjYQEi4jgH54c/vzO9UJuhsaXB6tF4NyUT++m7RBfFJ/fS1fmzREQ0Z1y2rt2/UH9topN6xkJvAYDCGJMdA673d/h27OKUru/xPW37yjuIXzLD8AkGoQXwuHsvLDLRpLbzNZGArarLkix9duTK8yNKJB6xjxa+fNsoGrLiMYQDOhptLrwc6N30AUkEtxKAz17mqqVais69Rq3Uy6fM4Xa7oj9xJ3Ob28jLG5UmEAgWmahYeVhkwrDWwRmBQ0Gr3o5Aw05UzAoJ4j28iqJf0zS+XFogIbdB4w0gkhBMAeMb6RAujKUGkDZWAAAnQ6eZgztZTdZaOExWlVLCxjWoXIBA4ExgpZTCp1NnMJebxo30FQwtfoOvmQu4V7uNp9wdOBw4Trl6tsI9omWmVC0VdjcfoO16gIgkClYGy/VJOFQNuqIj6Aqh78DXeMl3EDkzDVOatFxZYAx8CgDDnktbz3+R+piIqEpEtFhO0M38efp3albfbMTcN+w137zW9axABDwUaP7ht/X543l9ocmveaxWrVP6tU6qWhXUyKA6laUhs5Qq35V9yagYW7/IXdZjpy52/zQkcBBs8WSusOWoOji7djc0XbrVtqrMcmgPuF0BA6+zLJ/jq3yG/1Ff4qO/j2eK+cIH3x9Ofh6OQWxyAWAIfbvlxeDW7a/u8oR2tzn2eXXhVnL1B4Wlyvyvc7nk9VQ2eenmscKfD2/+0REc9NDO/+NR5f8C5qOXMHwTgDwAAAAASUVORK5CYII=";

export const metadata: Metadata = {
  title: "Khione | FrosteAto",
};

const overview: {
  id: string;
  name: string;
  image: string;
  blurDataURL: string;
  accent: Accent;
  role: string;
}[] = [
  { id: "desktop", name: "Desktop", image: "/images/khione/desktop-badge.png", blurDataURL: desktopBlur, accent: "purple", role: "Gaming + dev + creative" },
  { id: "server", name: "Server", image: "/images/khione/server-badge.png", blurDataURL: serverBlur, accent: "blue", role: "Self-hosted services" },
  { id: "node", name: "Node", image: "/images/khione/node-badge.png", blurDataURL: nodeBlur, accent: "yellow", role: "Always-on kiosk" },
  { id: "ulw", name: "Ultra Lightweight", image: "/images/khione/ulw-badge.png", blurDataURL: ulwBlur, accent: "green", role: "Ultra lightweight, build-it-yourself" },
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
      <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-8 lg:px-12">
        <BootWindow
          tagline="A custom Arch Linux distro built around a practical, opinionated setup for desktop, server, and kiosk use, focused on ease of setup."
          githubHref="https://github.com/FrosteAto/Khione"
          editions={overview}
        />
      </div>

      <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-8 lg:px-12">
        <EditionInfographic
          edition={{
            id: "desktop",
            name: "Desktop",
            image: "/images/khione/desktop-badge.png",
            blurDataURL: desktopBlur,
            accent: "purple",
            role: "Gaming + dev + creative",
            de: "KDE Plasma",
            terminal: "kitty",
            size: "~16.7 GB",
            packages: desktopPackages,
            intro: "Where it all began. After one too many rounds of distro-hopping and \
              reinstalling everything from scratch, I programmed my way to a distro with \
              everything I need pre-installed and fully configured - this is MY desktop.",
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
            image: "/images/khione/server-badge.png",
            blurDataURL: serverBlur,
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
            image: "/images/khione/node-badge.png",
            blurDataURL: nodeBlur,
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
            image: "/images/khione/ulw-badge.png",
            blurDataURL: ulwBlur,
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
