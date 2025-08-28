"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  CreditCard,
  ShoppingCart,
  Star,
  Heart,
  MessageCircle,
  MapPin,
  UtensilsCrossed,
  Boxes,
  Users,
  BarChart3,
  LayoutDashboardIcon,
  LineChart,
  PieChart,
  LockKeyholeIcon,
  BellIcon,
  Users2Icon,
  NewspaperIcon,
  Settings2Icon,
  Logs
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/rewards", label: "My Rewards", icon: Star },
  { href: "/account/preferences", label: "My Preferences", icon: Heart },
  { href: "/account/help", label: "Get Help", icon: MessageCircle },
  { href: "/account/orders", label: "Orders", icon: ShoppingCart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
  { href: "/account/security", label: "Security", icon: LockKeyholeIcon },
  { href: "/account/notification", label: "Notifications", icon: BellIcon },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

const adminItems = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/customers", label: "Customers", icon: Users2Icon },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/Promotions", label: "Promotions", icon: NewspaperIcon },
  { href: "/admin/settings", label: "Site Settings", icon: Settings2Icon },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/logs", label: "Logs", icon: Logs },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/reports/sales", label: "Sales Report", icon: LineChart },
  { href: "/admin/reports/inventory", label: "Inventory Report", icon: PieChart },
];

export default function Sidebar({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="px-2 py-4">
      <h3 className="px-4 pb-2 text-xl font-semibold">Account</h3>
      <div className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition
                hover:bg-gray-100 ${active ? "bg-gray-200 font-medium" : ""}`}
            >
              <Icon className="h-5 w-5 text-gray-600" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <h3 className="px-4 pt-6 pb-2 text-xl font-semibold">Admin</h3>
      <div className="space-y-1 pb-6">
        {adminItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition
                hover:bg-gray-100 ${active ? "bg-gray-200 font-medium" : ""}`}
            >
              <Icon className="h-5 w-5 text-gray-600" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      <LogoutButton />
    </nav>
  );
}
