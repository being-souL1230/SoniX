import { optionIds, type Category, type OptionId, type Scenario } from '../types/social';
import { additionalScenarios } from './additionalScenarios';

export const categories: Category[] = ['Life', 'Friendship', 'Career', 'College', 'Ethics', 'Money', 'Relationships', 'Everyday'];

const identities = [
  { name: 'The Quiet Optimist', tags: ['Hopeful', 'Big-picture thinker'] },
  { name: 'The Grounded Realist', tags: ['Practical', 'Experience-led'] },
  { name: 'The Gentle Challenger', tags: ['Curious', 'Open-minded'] },
  { name: 'The Thoughtful Observer', tags: ['Reflective', 'Careful listener'] },
  { name: 'The Boundary Keeper', tags: ['Self-aware', 'Direct'] },
  { name: 'The Bridge Builder', tags: ['Empathetic', 'Connection-first'] },
  { name: 'The Brave Beginner', tags: ['Adventurous', 'Learning as they go'] },
  { name: 'The Patient Questioner', tags: ['Analytical', 'Context-first'] },
];

interface ScenarioSeed {
  id: string;
  category: Category;
  title: string;
  description: string;
  choices: [string, string, string, string];
  voices: Record<OptionId, string[]>;
  insight: string;
}

const seeds: ScenarioSeed[] = [
  {
    id: 'a-secret-shared', category: 'Friendship',
    title: 'Your friend shared a secret you told them privately. What would you do?',
    description: 'You hear it from someone else. Your friend has not mentioned it, and you are not sure why they shared it.',
    choices: ['Confront them directly.', 'Quietly take a step back.', 'Ask why they shared it first.', 'Let it go if the damage is small.'],
    voices: {
      A: ["I would tell them it hurt me, without making it a trial. I have learned that avoiding a hard conversation can quietly end a friendship that honesty might have saved.", "Trust matters more to me than a comfortable afternoon. I would rather give them a clear chance to repair it than expect them to read my silence."],
      B: ["I once rushed into a confrontation and said things I could not take back. A little distance would help me work out whether I want an apology or just a different boundary.", "I can care about someone and stop giving them access to everything. I would stay kind, but I would share less until I felt safe again."],
      C: ["I asked why first when this happened to me. My friend had been genuinely worried about me and asked someone for help; the impact still mattered, but the intention changed the conversation.", "I would want to know what they thought they were doing. Understanding is not the same as excusing, and I can set a boundary after I have listened.", "Sometimes people have different definitions of private. I would start with a question, then explain exactly what I need from them next time."],
      D: ["Not every mistake needs to become a turning point. If no one was harmed and this was out of character, I would give them some grace, while making it clear that it was private."],
    },
    insight: 'Trust can be protected through honesty, distance, or curiosity. The difference is often what someone needs to feel safe, not how much they value the friendship.',
  },
  {
    id: 'plans-again', category: 'Friendship',
    title: 'A friend cancels your plans for the third time. How do you respond?',
    description: 'They apologize, but offer no explanation. You rearranged your week to make the evening work.',
    choices: ['Tell them how it affects me.', 'Let them arrange the next plan.', 'Check if they are doing okay.', 'Stop making plans with them.'],
    voices: {
      A: ["My time matters, even if their reason is understandable. I would explain the practical impact rather than argue about whether they are a good friend.", "I used to say it was fine and then feel resentful. A kind, honest conversation is less damaging than keeping a secret score."],
      B: ["I would leave the next invitation with them. That is not a test; I simply need the effort to be shared for the friendship to feel sustainable.", "They may be overcommitting without realizing it. Letting them choose a realistic time seems more useful than planning a fourth evening for both of us."],
      C: ["When I was struggling, I canceled everything because I could not explain what was happening. I would ask one genuine question before taking this personally.", "Repeated cancellations feel different from their usual behavior. I would offer something smaller, like a short walk, and see whether they need support."],
      D: ["I would stop reserving whole evenings for them, not erase the friendship. We might be better as people who meet spontaneously.", "I have a limited amount of energy outside work. I would put it into reliable connections rather than keep hoping a pattern will change."],
    },
    insight: 'A boundary and an act of care can look surprisingly similar. Both can make a friendship more honest about what each person can offer.',
  },
  {
    id: 'honest-opinion', category: 'Friendship',
    title: 'Your friend asks for your honest opinion on something they love. You dislike it.',
    description: 'They have spent months on a personal creative project and are excited to finally show you.',
    choices: ['Give honest, specific feedback.', 'Focus on what I genuinely like.', 'Ask what kind of feedback they want.', 'Celebrate the effort, not the result.'],
    voices: {
      A: ["I would name one strength and one thing that confused me. Respecting their work means taking it seriously enough to offer something useful.", "My closest friend is the person who tells me the truth kindly. I would do the same, but make clear that my taste is not an objective verdict."],
      B: ["There is usually something real to appreciate, even if the whole thing is not for me. I would not invent praise, but I do not need to list every reservation."],
      C: ["Do they want encouragement, editing, or a buyer's opinion? Those are different conversations, and asking saves us from having the wrong one.", "I once gave detailed criticism when someone only wanted me to witness a milestone. Now I ask before I pick anything apart.", "I would ask whether they are still making changes. Feedback on a finished project can be less helpful than understanding what they hoped to achieve."],
      D: ["Finishing something takes courage that my personal taste does not cancel out. I can sincerely celebrate their persistence without pretending to love the result.", "This moment belongs to them. If they ask for a detailed critique later, I will offer one, but today I would acknowledge the work it took."],
    },
    insight: 'Honesty is not only about the words you choose. Timing, consent, and the purpose of feedback can determine whether the same truth helps or hurts.',
  },
  {
    id: 'shared-credit', category: 'Career',
    title: 'A colleague presents your idea as their own in a meeting. What next?',
    description: 'Your manager seems impressed. You worked on the idea together, but you did most of the groundwork.',
    choices: ['Clarify my contribution in the meeting.', 'Talk to my colleague privately.', 'Document it and tell my manager.', 'Let it go and protect future work.'],
    voices: {
      A: ["I would add context, not an accusation: when I researched this, I found another useful detail. It makes my contribution visible without turning the meeting into a dispute.", "Public credit affects future opportunities. A calm correction now seems fairer than asking everyone to revise an impression weeks later."],
      B: ["They may have used 'I' carelessly rather than deliberately. I would explain what I noticed and ask them to clarify the shared effort in a follow-up.", "I value our working relationship, so I would start directly with them. If it happened again, I would handle it differently.", "A private conversation gives us both room to be less defensive. I would still be specific about the recognition I expect."],
      C: ["I have seen invisible work turn into invisible promotions. I would keep a factual record and bring it up in my next one-to-one, without speculating about motives.", "My manager needs an accurate view of the team's work. A brief note with the original research would correct the record without a public confrontation."],
      D: ["For a small, one-off idea, I would save my energy. Next time I would share progress in writing so ownership is clear before the presentation."],
    },
    insight: 'Recognition is both emotional and practical. Different responses may protect the relationship, the record, or future opportunity, without dismissing the value of the work.',
  },
  {
    id: 'better-offer', category: 'Career',
    title: 'A higher-paying job offers less meaningful work. Would you take it?',
    description: 'Your current role feels purposeful, but the new salary would make your finances much more comfortable.',
    choices: ['Take it for financial security.', 'Stay with work that matters to me.', 'Negotiate a middle ground.', 'Try it with a clear exit plan.'],
    voices: {
      A: ["Purpose feels different when rent is uncertain. I would build a financial cushion first, and find meaningful ways to contribute outside working hours.", "My family depends on my income. Taking care of them is meaningful work too, even if the job description is not inspiring.", "I enjoy my current role, but being underpaid has started to make me resent it. Security could give me more freedom to choose later."],
      B: ["I spend too much of my life working to feel disconnected from it every day. If my needs are covered, more money is not automatically a better life.", "I once took the better salary and spent it recovering from a job I disliked. I would take that experience seriously this time."],
      C: ["I would ask my current employer about pay and the new one about responsibilities. The first two offers might not be the only versions available.", "Before choosing, I would check whether the new role has a path toward more interesting work. A conversation might change the trade-off."],
      D: ["A job is a decision, not a life sentence. I would set a savings target and a six-month check-in so a temporary compromise does not become an accidental decade."],
    },
    insight: 'Meaning and security are not opposites for everyone. Life circumstances change what freedom looks like, and a good choice can be right for a season rather than forever.',
  },
  {
    id: 'always-available', category: 'Career',
    title: 'Your team keeps messaging after hours. Everyone else replies.',
    description: 'Nothing is an emergency, but you worry that staying offline will make you seem less committed.',
    choices: ['Set a clear after-hours boundary.', 'Reply only when it is truly urgent.', 'Ask the team to agree on expectations.', 'Keep replying until I feel secure.'],
    voices: {
      A: ["Being consistently available during work is the promise I made. I would state my hours politely and schedule non-urgent replies for the morning.", "My evenings are when I care for a family member. I do not want to offer a level of availability I cannot sustain."],
      B: ["I can be flexible without being permanently on call. I would mute the general channel and agree on a separate way to reach me for genuine emergencies.", "Sometimes a two-minute answer prevents a teammate from worrying all night. I would use judgment, but not let the exception become the rule."],
      C: ["Everyone might be replying because everyone else is replying. Naming that pattern could give the whole team permission to stop.", "I would ask what response time is actually expected. Unspoken rules create more anxiety than a clear policy, even if the policy is imperfect.", "A personal boundary helps me, but a team agreement helps the next person too. I would bring it up as a sustainability question."],
      D: ["I am new and still figuring out the culture. I would probably reply at first, while looking for a safer moment to discuss expectations; that is honest, even if it is not ideal."],
    },
    insight: 'The same boundary can carry different risks depending on someone\'s security and responsibilities. Collective clarity can make an individual choice easier.',
  },
  {
    id: 'exam-shortcut', category: 'College',
    title: 'A classmate offers you the answers before an important exam.',
    description: 'You are underprepared. They say half the class already has them, but you cannot verify that.',
    choices: ['Decline and take the exam honestly.', 'Warn them about the consequences.', 'Report the leaked answers privately.', 'Ask for the exam to be postponed.'],
    voices: {
      A: ["I would rather know what I can actually do. A lower grade is unpleasant, but wondering whether I earned my place would follow me longer.", "I would decline without making a speech. Other people's choices do not have to become my shortcut."],
      B: ["I would tell them I am worried about what happens if the leak is discovered. A friend deserves a chance to step back before this gets bigger.", "They sound panicked, not malicious. I would offer to revise together instead, while being clear that I will not use the answers."],
      C: ["Students who never received the leak deserve a fair exam. I would tell the instructor about the material rather than publicly name classmates.", "If the questions are compromised, the result will not measure learning. Reporting the leak protects the value of everyone's work.", "I would use a confidential channel if one exists. Fairness matters, but I would not pretend the social risk feels easy."],
      D: ["I would tell the instructor there may be a leak and ask for a replacement or delay. Fixing the assessment seems more important than hunting for blame."],
    },
    insight: 'Fairness can mean personal integrity, protecting classmates, or repairing a broken process. People may agree on the value while choosing different ways to uphold it.',
  },
  {
    id: 'group-project', category: 'College',
    title: 'One person has done almost nothing on your group project.',
    description: 'The deadline is tomorrow. The rest of the group wants to remove their name from the submission.',
    choices: ['Give them one clear final task.', 'Ask privately what is happening.', 'Explain contributions to the instructor.', 'Finish it and include everyone.'],
    voices: {
      A: ["I would give them a specific, useful piece with a clear deadline. 'Help more' is vague; one last concrete opportunity makes the decision fairer.", "We need a finished project, not a courtroom. A focused task could still help and show whether they are willing to contribute."],
      B: ["A teammate once disappeared because of a family crisis. I would ask privately before treating absence as indifference.", "I can be compassionate and still explain the impact. Knowing what is going on would help us choose a fair next step."],
      C: ["The instructor can assess contributions more fairly than an angry group can. I would provide a factual breakdown, not ask for a particular punishment.", "Everyone should receive credit for their own work. We should not have to absorb a grading problem to avoid an awkward conversation."],
      D: ["With one day left, I would protect the submission and address the imbalance afterward. I do not want a last-minute conflict to derail weeks of work.", "I would include them this time but not pretend the arrangement worked. Next project, I would insist on earlier checkpoints and shared accountability."],
    },
    insight: 'Accountability works best with context and clear expectations. Understanding a person\'s situation does not require making everyone else\'s effort invisible.',
  },
  {
    id: 'found-wallet', category: 'Ethics',
    title: 'You find a wallet with cash and no obvious contact number.',
    description: 'There is a name on an ID and a nearby shop is still open. You are already running late.',
    choices: ['Try to find the owner now.', 'Hand it to the nearby shop.', 'Take it to an official lost-property desk.', 'Leave it safely where it can be found.'],
    voices: {
      A: ["Losing a wallet can unravel an entire day. I would spend a few minutes looking for a public contact, without sharing their private details online.", "Someone once went out of their way to return mine. I would like to pass that care on if I can."],
      B: ["The owner will probably retrace their steps. A staffed shop nearby is a practical place for them to ask, and I can explain exactly where I found it.", "I would get the shopkeeper's name and make sure they are willing to keep it safe. Helping does not have to mean personally solving every part."],
      C: ["An official process makes me more comfortable with money and identification. I would note where it was found so the owner has a clear trail.", "I do not know the shop or the owner. A proper lost-property desk gives both of us a record and avoids misunderstandings.", "I would rather be a little late than leave someone's documents with a stranger. A formal handover feels like the most reliable option."],
      D: ["If there were no safe handover nearby and I could not carry it, I would move it out of foot traffic but keep it visible. I would worry that taking it far away makes it harder to recover."],
    },
    insight: 'Good intentions still need practical judgment. Proximity, privacy, and a reliable handover can matter as much as the time someone is willing to give.',
  },
  {
    id: 'ai-credit', category: 'Ethics',
    title: 'You used AI to help make something people are praising.',
    description: 'You directed and edited the work extensively. No one has asked about your process.',
    choices: ['Explain exactly how I used it.', 'Mention it if someone asks.', 'Credit the tool alongside my work.', 'Talk about the process, not the tool.'],
    voices: {
      A: ["I would be specific about what I made and what the tool generated. People can appreciate the work without having to guess how it happened.", "The praise might be based on a skill I did not demonstrate. A little clarity lets me accept credit for the judgment and editing I actually contributed."],
      B: ["I do not list every tool I use unless the context calls for it. I would answer honestly if asked, and check any rules before submitting the work.", "If this is a casual personal project, I would not turn every compliment into a disclosure statement. In a competition or paid commission, I would be explicit."],
      C: ["A short process note seems easy and fair. It recognizes that authorship can involve both creative direction and generated material.", "Normalizing clear credit would help everyone understand what they are looking at. I would mention the tool without pretending it did all the thinking."],
      D: ["I would show the drafts, choices, and edits. That gives a more honest picture of my contribution than a simple AI-or-not label.", "The meaningful question is what decisions I made. Explaining the process naturally includes the tool, but does not reduce the whole project to it."],
    },
    insight: 'Transparency is most useful when it explains contribution, not just a label. Context shapes what other people reasonably need to know.',
  },
  {
    id: 'money-and-friends', category: 'Money',
    title: 'A close friend asks to borrow money you were saving.',
    description: 'They need help with rent. You could cover it, but they have repaid you late before.',
    choices: ['Lend it with a clear repayment plan.', 'Offer a smaller amount as a gift.', 'Say no and help find another solution.', 'Lend it without setting conditions.'],
    voices: {
      A: ["I would write down an amount and a realistic date together. Clear expectations protect the friendship from becoming a collection of uncomfortable hints.", "Their last delay had a real reason. I would help, but only after checking that the plan works for both of our budgets."],
      B: ["I only lend what I can emotionally afford to lose. A smaller gift keeps me from silently monitoring their spending afterward.", "I cannot solve their entire rent problem, but I can reduce it. Calling it a gift lets the help stay help rather than turn into leverage.", "I have learned that money can change how I hear every conversation with a friend. A small, explicit gift avoids that dynamic."],
      C: ["My savings are for an emergency too. I would say no kindly and sit with them to explore payment arrangements or other support.", "A boundary is not a verdict on their character. I can care deeply while admitting that this loan would make my own life less secure."],
      D: ["Housing is urgent, and I trust this person even if timing has been difficult. I would help now, understanding that repayment might not happen on my preferred schedule."],
    },
    insight: 'Generosity is more sustainable when its limits are honest. The amount someone can give does not measure the depth of their care.',
  },
  {
    id: 'split-the-bill', category: 'Money',
    title: 'The group wants to split dinner equally. You ordered much less.',
    description: 'You chose a modest meal to stay within your budget. The difference is significant to you.',
    choices: ['Ask to pay for what I ordered.', 'Split it this time, clarify next time.', 'Quietly tell the person organizing.', 'Suggest everyone checks their share.'],
    voices: {
      A: ["I would keep it simple: I am watching my budget, so I will cover my meal. I do not need to defend the size of the difference to anyone else.", "Small costs add up. Speaking calmly now is better than avoiding future dinners because I am anxious about the bill.", "If a friend asked this, I would think it was completely reasonable. I want to give myself the same permission."],
      B: ["I might absorb it tonight if I could, then suggest separate bills before the next meal. Timing can make an otherwise simple request feel harder.", "I would choose the smooth exit this time, but not tell myself the pattern is fine. Next invitation, I would set the expectation early."],
      C: ["I would quietly mention my budget to whoever is sorting the payment. I prefer a practical adjustment to making the whole table discuss my finances.", "Sometimes the organizer simply has not noticed. A discreet conversation gives them a chance to help without putting me in the spotlight."],
      D: ["I would suggest paying by order for everyone. That makes fairness the shared approach rather than presenting my budget as a special exception."],
    },
    insight: 'What feels like a small convenience to one person may be a real cost to another. Clear expectations can make shared experiences more inclusive.',
  },
  {
    id: 'two-cities', category: 'Relationships',
    title: 'Your partner gets a dream opportunity in a city you do not want to live in.',
    description: 'You both like your current life. The opportunity would start in three months and last at least two years.',
    choices: ['Move and build something new together.', 'Try a long-distance relationship.', 'Explore a time-limited compromise.', 'Stay and be honest about my needs.'],
    voices: {
      A: ["Their excitement matters to me, and I can imagine finding my own reasons to love the city. I would move, but make a plan for my career and friendships too.", "Relationships sometimes ask us to take turns with opportunity. I would want this to feel like a shared adventure, not a debt they owe me."],
      B: ["Distance is difficult, but giving up my own life without exploring alternatives could create resentment. I would agree on visits and a date to reassess.", "We do not have to solve the next two years before trying the first few months. A clear plan could let both of us keep something important."],
      C: ["I would try six months and review how we are both doing. A reversible experiment feels more honest than pretending I am certain.", "Could we spend part of the year in each place, or could the role become flexible? I would explore practical options before treating this as a yes-or-no test.", "A compromise should include my needs too. I would define what support, work, and community would make a trial move possible."],
      D: ["Loving someone does not automatically make our paths compatible. I would be honest now rather than move and quietly punish them for a choice I made."],
    },
    insight: 'Commitment can mean moving together, making space, or telling a difficult truth. A compromise works best when neither person disappears inside it.',
  },
  {
    id: 'private-phone', category: 'Relationships',
    title: 'Your partner asks for your phone password as a sign of trust.',
    description: 'There has been no breach of trust. They say couples should have nothing to hide from each other.',
    choices: ['Share it because I feel comfortable.', 'Keep it private and explain why.', 'Ask what reassurance they really need.', 'Agree on mutual digital boundaries.'],
    voices: {
      A: ["Sharing a password would not bother me if it were genuinely optional. I would still make clear that access is not permission to read every private conversation.", "We already use each other's phones for practical things. I would share it, but not treat a different choice as proof that someone is hiding something."],
      B: ["My friends' messages are not mine alone to share. Privacy protects their trust as well as my own space, and it is different from secrecy.", "I want trust to mean believing me without continuous access. I would say that kindly and listen to their reaction."],
      C: ["A password might soothe the symptom without addressing the fear. I would ask whether something happened that made them feel uncertain.", "I have needed reassurance before, and the thing I requested was not always what I needed. I would start with the feeling underneath the request."],
      D: ["We should decide what privacy means to both of us before exchanging anything. Clear, mutual boundaries are more useful than a symbolic test.", "I would talk about emergencies, shared devices, and private conversations separately. One password does not answer all those questions."],
    },
    insight: 'Privacy and closeness can coexist. Trust becomes clearer when people discuss the need behind a request instead of using access as its only measure.',
  },
  {
    id: 'the-queue', category: 'Everyday',
    title: 'Someone cuts in front of you in a long queue. No one says anything.',
    description: 'You have been waiting twenty minutes. They seem distracted rather than openly confrontational.',
    choices: ['Politely point out where the line ends.', 'Ask if they are joining someone.', 'Let the staff handle it.', 'Let it go and save my energy.'],
    voices: {
      A: ["A friendly 'the line starts back there' is usually enough. I would assume confusion first, while still making the boundary clear.", "Silence can make unfairness feel normal. I do not need to be angry to speak up for everyone who has been waiting."],
      B: ["There may be a reason I cannot see. Asking a neutral question gives them an easy way to explain or correct a mistake.", "I once walked into the wrong end of a queue in a new place. I remember how much kinder a question felt than an accusation.", "I would check before reacting. A few seconds of curiosity might avoid turning a misunderstanding into a conflict."],
      C: ["If the line is crowded or tense, I would quietly mention it to staff. They can apply the same rule without making it personal.", "I am not comfortable confronting strangers. Asking someone responsible for the space still addresses the problem."],
      D: ["I would probably let one person go. Some days protecting my own calm is worth more to me than correcting a small unfairness."],
    },
    insight: 'Speaking up and staying calm are not mutually exclusive. People weigh fairness, safety, and emotional energy differently in small public moments.',
  },
  {
    id: 'noisy-neighbor', category: 'Everyday',
    title: 'Your neighbor plays loud music late at night. It keeps happening.',
    description: 'You have never properly met. You need an early start tomorrow and are becoming frustrated.',
    choices: ['Have a friendly conversation tomorrow.', 'Leave a polite, specific note.', 'Ask the building manager to help.', 'Knock and ask them to turn it down now.'],
    voices: {
      A: ["I would rather introduce myself when I am not exhausted and angry. A normal conversation could make future requests easier for both of us.", "They may not know how much sound travels. I would explain the issue and suggest quiet hours rather than describe them as inconsiderate."],
      B: ["A short note lets me choose my words carefully. I would include my name so it feels like a neighbor reaching out, not an anonymous threat.", "Our schedules never seem to overlap. A kind note with specific times would be a practical first step."],
      C: ["I would check the building's process, especially if late-night contact feels unsafe. I should not have to risk a confrontation to get some sleep.", "A shared reminder about quiet hours might solve it without singling anyone out. The manager can start there."],
      D: ["Tomorrow's conversation cannot give me tonight's sleep. I would knock once, be brief and polite, and leave if the response felt hostile.", "A simple request might work immediately. I would not assume they intend to disturb me before giving them a chance to lower it."],
    },
    insight: 'A good boundary is clear about the impact and realistic about safety. The right channel can matter as much as the right words.',
  },
  {
    id: 'starting-over', category: 'Life',
    title: 'You could start over in a new city, but you would know no one.',
    description: 'There is no urgent reason to leave. Life is comfortable, but you keep wondering what else is out there.',
    choices: ['Go and trust myself to build a life.', 'Stay and make my current life richer.', 'Try living there for a short time.', 'Wait until I have a clearer reason.'],
    voices: {
      A: ["I do not need a crisis to choose something new. I would make a budget, find a place to land, and accept that being a beginner is part of the point.", "The idea keeps returning because it matters to me. I would rather try with a sensible safety net than turn curiosity into a permanent what-if."],
      B: ["A new postcode will not automatically make me more open to life. I would try new communities and routines here before leaving the people who know me.", "Roots are not the opposite of growth. I would invest more intentionally in the place I already have."],
      C: ["I would spend a month there doing ordinary things, not treating it as a holiday. Daily life is a better test than an imagined version of myself.", "A short stay turns a dramatic decision into a useful experiment. I could learn something even if I decided not to move.", "I would arrange remote work or a sublet if possible. Keeping the decision reversible would help me be more honest about whether I like it."],
      D: ["Curiosity is real, but so are the costs of moving. I would save money and identify what I hope will change before committing."],
    },
    insight: 'Adventure does not always require a leap, and staying does not always mean standing still. Small experiments can turn imagined possibilities into informed choices.',
  },
  {
    id: 'family-expectations', category: 'Life',
    title: 'Your family has a plan for your future. It is not the one you want.',
    description: 'Their expectations come from care and sacrifice. You are grateful, but you feel yourself shrinking to fit them.',
    choices: ['Explain my own plan clearly.', 'Take a small independent step first.', 'Ask someone trusted to help us talk.', 'Give myself more time before deciding.'],
    voices: {
      A: ["I would acknowledge what they have given me and explain what I am building. Gratitude should not require living a life I do not recognize.", "A specific plan is easier to discuss than a general rejection. I would show that my choice comes from thought, not a desire to hurt them.", "They might be disappointed, and I cannot guarantee otherwise. I can be respectful without making their immediate approval the condition for my future."],
      B: ["I would try a course or a small project in the direction I want. Experience would help me speak with confidence rather than argue about an abstract dream.", "I still rely on my family financially. A gradual path toward independence feels safer and more realistic than one dramatic announcement."],
      C: ["A relative who understands both generations might help us hear each other. I want a conversation, not a contest over who is more grateful.", "We keep repeating the same argument. A trusted mediator could help translate the fear underneath their expectations and the need underneath mine."],
      D: ["I am still working out what I want, not just what I do not want. I would ask for time and use it actively, rather than commit to either path under pressure."],
    },
    insight: 'Independence and gratitude can exist together. The path toward an honest choice may depend on practical support as much as personal courage.',
  },
  {
    id: 'change-direction', category: 'College',
    title: 'Halfway through your degree, you realize you want to study something else.',
    description: 'Switching would add a year and extra cost. Staying feels practical, but your interest keeps fading.',
    choices: ['Switch to the subject I care about.', 'Finish, then change direction afterward.', 'Explore electives before committing.', 'Talk to an adviser about a hybrid path.'],
    voices: {
      A: ["Two years spent learning what I do not want are not wasted. I would check the finances carefully, but I would not spend decades protecting a past decision.", "I am finding it hard to do good work in a subject I no longer care about. One additional year might be a worthwhile investment in the next stage of my life."],
      B: ["Finishing gives me a qualification and more options. I would build experience in the new field alongside it rather than take on debt immediately.", "My degree does not have to determine my whole career. I would complete it strategically and look for a bridge into the work I want."],
      C: ["Liking the idea of a subject is not the same as liking its difficult parts. An elective would let me test my interest before restructuring my life.", "I would try an actual assignment or project in the new field. I want evidence that I am moving toward something, not only away from a hard semester."],
      D: ["There may be transferable credits or a combined program I have not considered. I would get the facts before accepting the most expensive version of the choice.", "An adviser could help me separate academic requirements from assumptions. Sometimes the path between two interests already exists."],
    },
    insight: 'Past effort can inform a decision without dictating it. Testing an alternative and checking the practical paths can make a change more deliberate.',
  },
  {
    id: 'save-or-go', category: 'Money',
    title: 'Your friends plan a once-in-a-lifetime trip. It would use most of your savings.',
    description: 'You have a small emergency fund and no debt. You worry about missing the experience and losing your safety net.',
    choices: ['Go; the shared experience matters.', 'Keep saving and sit this one out.', 'Join for a shorter, affordable version.', 'Suggest a less expensive trip for everyone.'],
    voices: {
      A: ["This particular group may never have the same time together again. I would keep a minimum emergency buffer and accept a slower savings year.", "I have postponed meaningful experiences for a future that keeps moving. If I can afford the real cost without debt, I would choose the memory this time."],
      B: ["An empty safety net would make the trip stressful for me. Missing one experience is hard, but financial peace changes my everyday life.", "I would celebrate their excitement without treating my absence as a friendship failure. There will be other ways to spend time together."],
      C: ["I could join the first few days or skip the expensive extras. A smaller version is still a real experience, not a consolation prize.", "I would decide what I can spend first, then build my part of the trip around that number. The budget should shape the plan, not disappear inside it.", "Being honest might reveal that someone else is worried about money too. A shorter trip could let more of us participate comfortably."],
      D: ["I would suggest an alternative without demanding they abandon their dream. The most important part for me is being together, and that may cost less than we think."],
    },
    insight: 'A meaningful experience does not have to be all or nothing. Honest budgets can reveal ways to belong without giving up the security you need.',
  },
];

const originalScenarios: Scenario[] = seeds.map((seed, scenarioIndex) => {
  let responseIndex = 0;
  const responses = optionIds.flatMap((selectedOption) => seed.voices[selectedOption].map((reasoning) => {
    const index = responseIndex++;
    const identity = identities[(index + scenarioIndex) % identities.length];
    return {
      id: `${seed.id}-${index}`,
      anonymousLabel: identity.name,
      selectedOption,
      reasoning,
      tags: identity.tags,
      avatar: (index + scenarioIndex) % identities.length,
    };
  }));
  // Interleave choices so the first row does not imply a ranking or consensus.
  responses.sort((a, b) => (Number(a.id.split('-').pop()) * 5 % 8) - (Number(b.id.split('-').pop()) * 5 % 8));
  return {
    id: seed.id,
    category: seed.category,
    title: seed.title,
    description: seed.description,
    options: optionIds.map((id, index) => ({ id, label: seed.choices[index] })),
    responses,
    insight: seed.insight,
  };
});

export const scenarios: Scenario[] = [...originalScenarios, ...additionalScenarios];

export const getScenario = (id: string) => scenarios.find((scenario) => scenario.id === id);