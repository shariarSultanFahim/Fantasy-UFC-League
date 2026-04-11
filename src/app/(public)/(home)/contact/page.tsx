import { Clock3, Mail, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-xl bg-slate-950 px-6 py-14 text-center text-white shadow-md sm:px-10">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">CONTACT US</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Need help with your roster or have feedback for the league? We&apos;re here to help you
            stay in the fight.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.9fr_0.9fr]">
          <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-2 text-slate-900">
                <h2 className="text-3xl font-extrabold tracking-tight">Send us a message</h2>
              </div>

              <form className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="full-name"
                      className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase"
                    >
                      Name
                    </Label>
                    <Input
                      id="full-name"
                      placeholder="Your full name"
                      className="h-11 border-slate-200 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="champion@ffleague.com"
                      className="h-11 border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you today?"
                    className="min-h-40 resize-none border-slate-200 bg-slate-50"
                  />
                </div>

                <Button className="h-11 bg-slate-950 px-7 text-[13px] font-bold tracking-[0.18em] text-white uppercase hover:bg-slate-800">
                  Send Message
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-xl border-[#D4AF37]/25 bg-[#D4AF37]/8 shadow-sm">
              <CardContent className="flex gap-3 p-5">
                <Clock3 className="mt-0.5 h-4 w-4 text-[#D97706]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Response Time</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Our support team typically responds within 24-48 hours during fight weeks.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="mb-4 text-[11px] font-bold tracking-[0.26em] text-slate-400 uppercase">
                  Support Channels
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-orange-100 p-2 text-orange-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Email Us</p>
                      <a
                        href="mailto:support@fantasyfightleague.com"
                        className="text-sm font-bold text-slate-900 hover:text-slate-700"
                      >
                        support@fantasyfightleague.com
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-indigo-100 p-2 text-indigo-600">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Community Discord</p>
                      <a
                        href="/help"
                        className="text-sm font-bold text-slate-900 hover:text-slate-700"
                      >
                        Join the Discord Server
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
