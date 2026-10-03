import { Brain, Briefcase, Calculator, GraduationCap, Heart, Languages, Scale, Shield, Users } from "lucide-react";



const ICONS: Record<CourseCard['icon'], typeof Scale> = {
    scale: Scale,
    languages: Languages,
    briefcase: Briefcase,
    calculator: Calculator,
    users: Users,
    brain: Brain,
    shield: Shield,
    heart: Heart,
    graduation: GraduationCap,
}

export function CourseIcon({ icon, className }: { icon: CourseCard['icon']; className?: string}){
    const Icon = ICONS[icon];
    return <Icon className={className} strokeWidth={1.75} />;
}