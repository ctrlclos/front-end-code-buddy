import { Link } from "react-router";

const Landing = () => {
    return (
        <main className="max-w-3xl mx-auto px-8 py-20">
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">
                    Practice coding challenges.<br />
                    Build real confidence.
                </h1>
                <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
                    Code Buddy is a platform where developers create challenges,
                    solve them with instant feedback, and track their growth over time.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        to="/sign-up"
                        className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/sign-in"
                        className="px-6 py-2.5 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-3">
                <div className="p-5 rounded-lg border border-border-subtle bg-bg-card">
                    <h2 className="text-sm font-bold mb-2">Create & Solve</h2>
                    <p className="text-sm text-muted">
                        Author your own coding challenges or practice ones
                        created by the community. Code runs in a secure sandbox
                        with instant pass/fail results.
                    </p>
                </div>
                <div className="p-5 rounded-lg border border-border-subtle bg-bg-card">
                    <h2 className="text-sm font-bold mb-2">AI-Powered Test Cases</h2>
                    <p className="text-sm text-muted">
                        Generate test cases with a single click. The AI produces
                        edge cases and hidden tests so your challenges are thorough
                        from the start.
                    </p>
                </div>
                <div className="p-5 rounded-lg border border-border-subtle bg-bg-card">
                    <h2 className="text-sm font-bold mb-2">Track Progress</h2>
                    <p className="text-sm text-muted">
                        See which challenges you have completed, monitor your
                        submissions, and watch your skills grow as you practice.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Landing;
