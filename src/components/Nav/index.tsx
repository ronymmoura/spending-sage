import { NavItem } from "./NavItem";
import { GoHome, GoCalendar, GoBookmark } from "react-icons/go";
import { PiMoneyWavyLight } from "react-icons/pi";

export function Nav() {
  return (
    <nav className="pr-5 min-w-[240px]">
      <ul className="space-y-3">
        <NavItem icon={<GoHome size={24} />} title="Dashboard" link="/dashboard" />
        <NavItem icon={<GoCalendar size={20} />} title="Months" link="/months" />
        <NavItem icon={<GoBookmark size={20} />} title="Fixed Entries" link="/fixed_entries" />
        <NavItem icon={<PiMoneyWavyLight size={20} />} title="Expected Payments" link="/expected_payments" />
      </ul>
    </nav>
  );
}
