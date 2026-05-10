import { ArrowRight, Calendar, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/components/Button";
import StepItem from "../ui/Item";
import FeatureCard from "../ui/FeatureCard";
import AnimateCard from "../ui/AnimateCard";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen  text-gray-900">

            <section className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-14 items-center">

                <AnimateCard>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs mb-6">
                        Smart Booking Platform
                    </div>

                    <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface leading-tight">
                        Book Expert<span className="text-[#24389c] italic"> Consultations </span> in Seconds
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                        Schedule appointments with top consultants instantly.
                        No waiting, no confusion — just real-time availability and simple booking.
                    </p>

                    <div className="mt-10 flex gap-4 flex-wrap">
                        <Button
                            onClick={() => navigate("/login")}
                            className="px-6 py-3 text-base flex items-center gap-2"
                        >
                            Get Started <ArrowRight size={18} />
                        </Button>

                        <Button onClick={() => navigate("/login")} variant="outline" className="px-6 py-3 text-base">
                            View Consultants
                        </Button>
                    </div>
                </AnimateCard>

                <AnimateCard className="relative">
                    <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold">How it works</h3>
                            <p className="text-sm text-gray-500">
                                3 simple steps to book your session
                            </p>
                        </div>

                        <div className="space-y-6">
                            <StepItem
                                icon={Calendar}
                                title="Choose a Date"
                                description="Pick your preferred day"
                            />

                            <StepItem
                                icon={Clock}
                                title="Pick a Time Slot"
                                description="Only available slots shown"
                            />

                            <StepItem
                                icon={UserCheck}
                                title="Meet Consultant"
                                description="Get expert guidance instantly"
                            />
                        </div>
                    </div>
                </AnimateCard>
            </section>

            <section className="py-24 bg-[#e6f3fb] border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold tracking-tight">
                            Why people choose us
                        </h2>
                        <p className="text-gray-600 mt-3">
                            A faster, simpler way to manage consultations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Calendar}
                            title="Instant Scheduling"
                            description="Book available time slots without friction or delays."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Live Availability"
                            description="See only real-time open slots from consultants."
                        />
                        <FeatureCard
                            icon={UserCheck}
                            title="Verified Experts"
                            description="Work with trusted professionals in different fields."
                        />
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <div className="relative overflow-hidden rounded-3xl p-12 shadow-2xl text-white bg-gradient-to-br from-[#4355b9] via-[#5a6ee1] to-[#7f8cff]">

                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Start booking smarter today
                            </h2>

                            <p className="text-gray-200 mb-8">
                                Find the right consultant and reserve your slot instantly.
                            </p>

                            <Button
                                onClick={() => navigate("/login")}
                                className="px-8 py-4 text-black hover:bg-gray-800"
                            >
                                Get Started <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
