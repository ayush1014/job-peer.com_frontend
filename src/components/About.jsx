import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Ayush from "../../src/assets/Ayush.jpeg";
import Deep2 from "../../src/assets/Deep2.jpeg";
import Kushank from "../../src/assets/Kushank.jpeg";
import Logo from "../../src/assets/J.png";
import Logo1 from "../../src/assets/Jwhite.png";
import AppImg from "../../src/assets/AppFeatures1.png";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

import {
  AcademicCapIcon,
  HandRaisedIcon,
  RocketLaunchIcon,
  SparklesIcon,
  SunIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import {
  BoltIcon,
  CalendarDaysIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm(
      "service_o7n9bjl",
      "template_vvsurob",
      e.target,
      "3FDfYE1VRfb0tWDKO"
    )
    .then(
      (result) => {
        // console.log(result.text);
      },
      (error) => {
        // console.log(error.text);
      }
    );
  e.target.reset();
};

const primaryFeatures = [
  {
    name: "Application Status",
    description:
      "Manage your job applications seamlessly with the Application Status feature. Take control of your hiring journey by manually updating the status of your applications. Whether you are currently Interviewing, Following up, in Application Processing, or have received a Rejection, this feature empowers you to reflect the real-time status of your job applications. Stay organized and informed throughout the hiring process with ease.",
    href: "#",
    icon: BoltIcon,
  },
  {
    name: "Connect With Peers.",
    description:
      "Stay connected with your professional network. Follow and connect with friends to keep up with their career journey. Track the job applications of your peers, and gain insights into their job search process. Discover job statistics related to your connections and stay informed about their career milestones.",
    href: "#",
    icon: UsersIcon,
  },
  {
    name: "Adding Job.",
    description:
      "Keep track of your job applications effortlessly by manually adding the jobs you applied to. This feature allows you to save essential details such as Job Title, Job Description, and the link to the job posting. Stay organized and informed about your job search journey with this convenient tool.",
    href: "#",
    icon: CalendarDaysIcon,
  },
];

const navigation = [
  // { name: 'Product', href: '#' },
  // { name: 'Features', href: '#' },
  // { name: 'Marketplace', href: '#' },
  // { name: 'Company', href: '#' },
];
// const stats = [
//   { label: 'Business was founded', value: '2024' },
//   { label: 'People on the team', value: '120+' },
//   { label: 'Users on the platform', value: '250k' },
//   { label: 'Paid out to creators', value: '$70M' },
// ]
const values = [
  {
    name: "Be World-Class.",
    description:
      "Strive for excellence in your job search. Track and manage your job applications efficiently on our platform.",
    icon: RocketLaunchIcon,
  },
  {
    name: "Take Responsibility.",
    description:
      "Own your job search journey. Take charge of your applications and stay on top of your career aspirations.",
    icon: HandRaisedIcon,
  },
  {
    name: "Be Supportive.",
    description:
      "Connect with fellow students, support each other, and share insights on job opportunities and application experiences.",
    icon: UserGroupIcon,
  },
  {
    name: "Always Learning.",
    description:
      "Embrace continuous learning. Stay updated on industry trends, improve your skills, and enhance your employability.",
    icon: AcademicCapIcon,
  },
  {
    name: "Share Everything You Know.",
    description:
      "Contribute to the community. Share your job search tips, successful interview strategies, and valuable insights.",
    icon: SparklesIcon,
  },
  {
    name: "Enjoy Downtime.",
    description:
      "Maintain a healthy work-life balance. Take breaks, relax, and recharge to ensure a successful and sustainable job search.",
    icon: SunIcon,
  },
];
const team = [
  {
    name: "Ayush Kanaujia",
    role: "Founder",
    img: Ayush,
    location: "New York, USA",
  },
  {
    name: "Deep Shikha",
    role: "Co-Founder",
    img: Deep2,
    location: "New York, USA",
  },
  {
    name: "Kushank Singh",
    role: "Co-Founder",
    img: Kushank,
    location: "Florida, USA",
  },
];

// const benefits = [
//   'Competitive salaries',
//   'Flexible work hours',
//   '30 days of paid vacation',
//   'Annual team retreats',
//   'Benefits for you and your family',
//   'A great work environment',
// ]

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div
      style={{
        background: "white",
      }}
    >
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <button className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-20 w-auto"
                src={Logo}
                alt="Logo"
                onClick={() => navigate("/login")}
              />
            </button>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <span
              className="text-md font-semibold leading-6 text-gray hover:text-black cursor-pointer"
              onClick={handleLogin}
            >
              Log in{" "}
              <span classname="hover:ml-3" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <button href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-20 w-auto"
                  src={Logo1}
                  alt=""
                  onClick={() => navigate("/login")}
                />
              </button>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/25">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <button
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    onClick={handleLogin}
                  >
                    Log in
                  </button>
                  <button
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main className="relative isolate">
        {/* Background */}
        <div
          className="absolute inset-x-0 top-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-blue-500 to-red-500 opacity-25"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>

        <div className="shadow-lg p-6 bg-white-200">
          {/* Header section */}
          <div className="px-6 pt-10 lg:px-8">
            <div className="mx-auto max-w-2xl pt-10 text-center sm:pt-10">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Job Peer
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-500">
                Empower your job search with our Tracking Pro, your trusted ally
                in tracking career opportunities.
              </p>
            </div>
          </div>

          {/* Content section */}
          <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-900 lg:max-w-none lg:grid-cols-2">
                <div>
                  <p>
                    Welcome to the Job Peer Application Tracker, where you can
                    seamlessly manage your job applications and stay organized
                    in your job search journey. Our platform empowers you to
                    track your applied jobs, connect with friends, and monitor
                    your progress effortlessly.
                  </p>
                  <p className="mt-8">
                    Easily manage and save details about the jobs you've applied
                    for, collaborate with your network, and gain insights into
                    your application statistics. Your success is our priority,
                    and we're here to support you throughout your job hunting
                    experience.
                  </p>
                </div>
                <div>
                  <p>
                    Take control of your career path with our intuitive Job
                    Application Tracker. Organize your applications, receive
                    valuable insights, and stay informed about your job search
                    progress. We understand the importance of a seamless job
                    application process, and we're here to make it a reality for
                    you.
                  </p>
                  <p className="mt-8">
                    Utilize features such as easy data entry, application status
                    updates, and collaborative tools to enhance your job search
                    experience. Your journey to a successful career begins here,
                    and we're excited to be a part of it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="shadow-lg p-6 mt-1 bg-blue-200">
          <div className="mt-10 sm:mt-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="text-base font-bold leading-7 text-gray-900">
                  Our Website Features.
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  Everything You need to Know!
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-700">
                  These are some of the intersting features We have added in our
                  Job Peer Website.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden pt-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <img
                  src={AppImg}
                  alt="App screenshot"
                  className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
                  width={2432}
                  height={1442}
                />
                <div className="relative" aria-hidden="true">
                  <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-900 pt-[7%]" />
                </div>
              </div>
            </div>
            <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {primaryFeatures.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-black">
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-900">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-800">
                      <p className="flex-auto">{feature.description}</p>
                      <p className="mt-6"></p>
                    </dd>
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring focus:ring-indigo-900 active:bg-indigo-900"
                  onClick={() => navigate("/signup")}
                >
                  Check out Job-Peer.com
                </button>
              </dl>
            </div>
          </div>
        </div>
        {/* Values section */}
        <div className="shadow-lg p-6 mt-1 bg-white-200">
          <div className="mx-auto mt-10 max-w-7xl px-6 sm:mt-10 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our values
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-900">
                Strive for success, and you will overcome any obstacles in your
                way.
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-900 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
              {values.map((value) => (
                <div key={value.name} className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <value.icon
                      className="absolute left-1 top-1 h-5 w-5 text-indigo-900"
                      aria-hidden="true"
                    />
                    {value.name}
                  </dt>{" "}
                  <dd className="inline">{value.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Team section */}
        <div className="shadow-lg p-6 mt-1 bg-blue-200">
          <div className="mx-auto mt-10 max-w-7xl px-6 sm:mt-10 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our team
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-800">
                Meet the talented minds driving Job Peer – a dedicated team
                committed to shaping your career journey and success.
              </p>
            </div>
            <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
              {team.map((person) => (
                <li key={person.name}>
                  <img
                    className="aspect-[14/13] w-full rounded-2xl object-cover"
                    src={person.img}
                    alt=""
                  />
                  <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-black">
                    {person.name}
                  </h3>
                  <p className="text-base leading-7 text-gray-800">
                    {person.role}
                  </p>
                  <p className="text-sm leading-6 text-gray-900">
                    {person.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Enhanced Footer with Feedback Form */}
      <footer
        className="relative mt-10 sm:mt-10"
        aria-labelledby="footer-heading"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
          <div className="xl:grid xl:grid-cols-13 xl:gap-8">
            <div className="space-y-8">
              <img
                className="h-20"
                src={Logo}
                alt="Company name"
                onClick={() => navigate("/login")}
              />
              {/* <p className="text-sm leading-6 text-indigo-800">
          Discover the full experience on our website and share your valuable feedback with us. We trust you'll find our application a delight to use for your daily job applications. Explore, connect, and enjoy your journey with Job Peer!
        </p> */}
            </div>
            <p className="text-2sm leading-6 text-indigo-800 mt-4">
              Discover the full experience on our website and share your
              valuable feedback with us. We trust you'll find our application a
              delight to use for your daily job applications. Explore, connect,
              and enjoy your journey with Job Peer!
            </p>
            <div className="mt-8 xl:mt-0">
              <form className="grid grid-cols-1 gap-6" onSubmit={sendEmail}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-800"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    className="mt-1 p-3 border border-gray-300 block w-full rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    className="mt-1 p-3 border border-gray-300 block w-full rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    className="mt-1 p-3 border border-gray-300 block w-full rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    rows="4"
                    className="mt-1 p-3 border border-gray-300 block w-full rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                    placeholder="Your valuable feedback..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring focus:ring-indigo-900 active:bg-indigo-900"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 sm:mt-10 lg:mt-10">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 Job Peer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
