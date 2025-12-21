import { NovelStatus, Role } from "@/prisma/generated/prisma/enums";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { User } from "./generated/prisma/browser";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/--+/g, "-")
		.trim();
}

async function main() {
	console.log("🌱 Seeding database...");

	// Create tags
	const tagsData = [
		"Fantasy",
		"Romance",
		"Action",
		"Adventure",
		"Sci-Fi",
		"Mystery",
		"Horror",
		"Comedy",
		"Drama",
		"Slice of Life",
		"Martial Arts",
		"Magic",
		"Isekai",
		"System",
		"Reincarnation",
	];

	const tags = await Promise.all(
		tagsData.map((name) =>
			prisma.tag.upsert({
				where: { slug: slugify(name) },
				update: {},
				create: {
					name,
					slug: slugify(name),
				},
			})
		)
	);

	console.log(`✅ Created ${tags.length} tags`);

	// Create an author user
	const author = await prisma.user.upsert({
		where: { email: "author@example.com" },
		update: {},
		create: {
			name: "Demo Author",
			email: "author@example.com",
			emailVerified: true,
			role: Role.AUTHOR,
			isActive: true,
		},
	});

	console.log(`✅ Created author: ${author.name}`);

	// Sample novels data
	const novelsData = [
		{
			title: "The Dragon's Apprentice",
			description:
				"A young orphan discovers they have the rare ability to communicate with dragons. Taken under the wing of an ancient dragon, they must learn to harness their powers while navigating a world where dragons are hunted for their magical essence. As war looms on the horizon, the fate of both humans and dragons rests on their shoulders.",
			status: NovelStatus.ONGOING,
			coverImageUrl: "https://picsum.photos/seed/dragon/400/600",
			tags: ["Fantasy", "Adventure", "Magic", "Drama"],
			chapters: [
				{
					title: "The Awakening",
					content: `The morning mist clung to the village like a mother's embrace, reluctant to let go even as the first rays of sunlight pierced through the ancient oaks. Aria had always loved these quiet moments before the world truly woke—when she could pretend she was just another girl, not the orphan everyone whispered about.

She pulled her worn shawl tighter and made her way toward the old well at the edge of the village. Her bucket was older than she was, held together by prayers and rust, but it still served its purpose. As she lowered it into the darkness, a sound made her freeze.

It wasn't the usual creaking of the rope or the distant crow of a rooster. This was something else entirely—a deep, resonant hum that seemed to vibrate in her very bones.

"You can hear me."

Aria spun around, her heart hammering against her ribs. There was nothing there—nothing but the swirling mist and the skeletal silhouettes of trees.

"Down here, child. In the well."

Against every instinct screaming at her to run, Aria peered over the stone edge. Two enormous eyes, each the size of a harvest moon and burning with ancient gold, stared back at her from the impossible depths.

"Don't be afraid," the voice rumbled, and Aria realized it wasn't speaking aloud at all. The words formed directly in her mind, warm and oddly comforting. "I have waited three hundred years for someone like you."`,
				},
				{
					title: "Wings of Destiny",
					content: `Three days had passed since Aria's encounter at the well, and she had told no one. Who would believe her? The village already thought her strange enough—talking to herself in the fields, humming songs she'd never been taught, knowing when the rains would come before the first cloud appeared in the sky.

But the dragon—for that's what it must have been—had asked her to return. And despite the fear that coiled in her stomach like a living thing, Aria found herself drawn back to the well each night, listening to stories older than the kingdom itself.

"Long ago," the dragon had told her, "humans and dragons were partners. We shared our magic, our wisdom, our very souls. But greed corrupted the bond, and one by one, my kind were hunted, slain for the power in our blood."

"Why are you in the well?" Aria had asked.

A sound like grinding boulders filled her mind—dragon laughter, she realized. "I am not in the well, young one. I am beneath it, beneath your entire village. The well is merely... a window."

Tonight, as Aria approached the well under a blanket of stars, she sensed something was different. The usual hum was replaced by urgency, a pressing need that made her break into a run.

"They're coming," the dragon's voice thundered in her head. "The hunters have found me. And when they dig me out, they will find you too—the first Dragon Speaker born in a century. You must flee, child. You must survive."`,
				},
				{
					title: "The Flight North",
					content: `The night Aria fled her village, she carried nothing but the clothes on her back and a small pouch of coins she'd been saving for years—her "escape fund," though she'd never truly believed she'd need it.

The dragon had given her directions: follow the North Star until the mountains swallowed the horizon, then seek the Valley of Echoes, where the last free dragons had taken refuge.

"My name is Pyranthus," the dragon had finally told her. "Remember it, for I have not shared it with a human in three centuries. When you reach my kin, speak my name, and they will know you are true."

For three weeks, Aria walked. She learned to forage, to hide from travelers, to read the land the way the dragon had begun to teach her. And slowly, almost imperceptibly, she began to change.

It started with her eyes—they seemed to catch the light differently, reflecting like a cat's in the darkness. Then her hearing sharpened until she could track a rabbit's heartbeat from fifty paces. And sometimes, when fear or anger surged through her, she could swear she felt heat building in her chest, desperate for release.

"The bond is awakening," she whispered to herself, remembering Pyranthus's teachings. "I am becoming what I was always meant to be."

The mountains loomed ahead, their peaks lost in clouds. Somewhere beyond them lay the Valley of Echoes. Somewhere beyond them lay her destiny.`,
				},
			],
		},
		{
			title: "Starship Renegade",
			description:
				"In a galaxy ruled by corrupt corporations, a ragtag crew of outlaws stumbles upon a secret that could topple the entire power structure. On the run from bounty hunters and corporate assassins, they must decide whether to sell the information to the highest bidder or risk everything to set the galaxy free.",
			status: NovelStatus.ONGOING,
			coverImageUrl: "https://picsum.photos/seed/starship/400/600",
			tags: ["Sci-Fi", "Action", "Adventure"],
			chapters: [
				{
					title: "Dead Drop",
					content: `The Rusty Nail wasn't the kind of bar where you asked questions. Tucked into the lower decks of Nexus Station, where the artificial gravity flickered and the recycled air tasted like someone else's regrets, it was the perfect place to disappear.

Captain Zara Chen nursed her synth-whiskey and watched the door. Her contact was late—never a good sign in their line of work.

"Getting stood up?" Her pilot, a blue-skinned Rellian named Vex, slid into the booth across from her. His four eyes swept the room with practiced paranoia.

"Delayed," Zara corrected. "There's a difference."

"Sure there is." Vex's translator implant gave his voice an electronic buzz that made everything sound sarcastic. "Just like there's a difference between 'salvage operation' and 'piracy.'"

Before Zara could respond, the door hissed open, and a figure stumbled through—human, male, bleeding from a wound in his shoulder that had turned his cheap suit a concerning shade of crimson.

"Captain Chen?" He collapsed into their booth, leaving a smear of blood on the table. "They're coming. You need to see this. You need to—"

He pressed a data chip into her palm just as the lights went out.

In the sudden darkness, Zara heard the distinctive whine of corporate-issue pulse rifles charging. Someone had sold them out. Again.

"Vex," she said calmly, "I think it's time to leave."`,
				},
				{
					title: "The Axiom Protocol",
					content: `The Crimson Void punched through hyperspace like a bullet through wet paper, leaving Nexus Station and their pursuers three systems behind. In the relative safety of FTL travel, Zara finally allowed herself to examine the data chip.

"What's on it?" Mira, their engineer, leaned over her shoulder. The young woman's cybernetic arm whirred as she adjusted her position. "Must be important if OmniCorp sent kill teams."

"That's what I'm trying to find out." Zara plugged the chip into their isolated computer terminal—standard protocol for unknown data. The last thing they needed was a corporate virus burning through their systems.

The files that appeared made her blood run cold.

"Axiom Protocol," she read aloud. "Authorization: Board of Directors, OmniCorp Central." She scrolled through pages of technical specifications, test results, and—her stomach turned—casualty reports. "They're testing a biological weapon. On colonies."

"Which colonies?" Vex's voice had lost its usual sardonic edge.

Zara pulled up a star map covered in red dots—each one a test site. Thousands of lives, maybe millions, extinguished in the name of corporate profit.

"All of them," she whispered. "They're testing it everywhere. And according to this timeline, full deployment is in six months."

The bridge fell silent. They were smugglers, thieves, outcasts. They survived by keeping their heads down and avoiding trouble.

But this? This was something else entirely.

"Well," Mira said finally, "I guess we're not keeping our heads down anymore."`,
				},
			],
		},
		{
			title: "The Last Enchanter",
			description:
				"Magic is dying. The ancient bloodlines that once wielded arcane power have dwindled to nothing, and the last Enchanter—a cynical old man with more regrets than years left—finds himself burdened with an apprentice he never wanted. Together, they must find a way to reignite the world's magic before it fades forever.",
			status: NovelStatus.COMPLETED,
			coverImageUrl: "https://picsum.photos/seed/enchanter/400/600",
			tags: ["Fantasy", "Magic", "Drama", "Adventure"],
			chapters: [
				{
					title: "The Dying Light",
					content: `Marcus Grey had buried six apprentices. Each one had been a reminder of his failure—not to teach them, but to save a world that had forgotten how to believe in magic.

Now, at seventy-three, with his joints aching and his power reduced to lighting candles and mending cracked pottery, he had resigned himself to being the final chapter of a very long book.

Then the girl arrived.

She was perhaps sixteen, with wild red hair and eyes that held the unmistakable spark—that inner flame he hadn't seen in anyone for decades. She stood at his cottage door in the pouring rain, soaked to the bone and shivering, but her voice was steady when she spoke.

"I can make things happen," she said. "Things I can't explain. My village thinks I'm cursed. They were going to—" She stopped, swallowed hard. "I heard there was a man in these woods who understands."

Marcus should have sent her away. He should have told her that magic was dead, that whatever abilities she possessed would fade like morning dew, that learning from him would only prolong her suffering.

Instead, he stepped aside and opened his door.

"I suppose you'd better come in," he said gruffly. "I'll put the kettle on."

That night, for the first time in twenty years, Marcus felt hope stir in his chest—fragile as a newborn flame, but unmistakably alive.`,
				},
				{
					title: "First Lessons",
					content: `"Magic isn't about power," Marcus explained, watching Elara attempt to levitate a feather for the hundredth time. "It's about connection. You're trying to force the feather to obey you. You need to ask it to dance."

Elara's face scrunched in frustration. "It's a feather. It can't hear me."

"Everything hears, child. Everything is alive with the old energy, even now when it's fading. A rock, a river, a feather—they all remember what magic felt like when the world was young. Your job is to remind them."

She closed her eyes and tried again. For a moment, nothing happened. Then the feather trembled, rose an inch off the table, and floated gently toward the ceiling.

Elara's eyes flew open. "I did it!"

"Don't get cocky," Marcus grumbled, but he couldn't hide the smile tugging at his lips. "That's the easy part. Now we need to talk about why magic is dying—and what you might be able to do about it."

He led her to his study, where ancient maps covered the walls and books older than the kingdom itself gathered dust on sagging shelves. At the center of the room stood a model of the world, with glowing points marking the locations of the Wellsprings—the sources of all magical energy.

"There used to be seven," Marcus said. "Now there are two. When the last one goes dark..."

"No more magic," Elara finished.

"No more magic. No more Enchanters. No more anything, eventually. The world needs magic like lungs need air. It just doesn't know it yet."`,
				},
				{
					title: "The Journey Begins",
					content: `They left the cottage on a morning that couldn't decide between rain and sunshine, carrying everything they needed in two worn packs. Marcus had argued against the journey—he was too old, too weak, too far past his prime—but Elara had worn down his resistance with the same stubborn determination that had brought her to his door.

"The nearest Wellspring is in the Thornwood," Marcus said, consulting a map so old it might crumble at a harsh word. "Three weeks on foot, assuming the roads are still there."

"And if they're not?"

"Then we improvise." He folded the map carefully and tucked it into his coat. "I used to be quite good at improvising, you know. Before I became old and sensible."

Elara laughed—a sound that had become increasingly common in the past weeks. "I have trouble imagining you as anything but old and sensible."

"Brat." But Marcus was smiling as he said it. For the first time in decades, he felt like himself again—not the bitter hermit waiting to die, but the adventurer who had once crossed continents in search of lost knowledge.

Maybe this mission was doomed to fail. Maybe magic would die no matter what they did. But at least they would go down fighting.

And maybe, just maybe, the world had one more miracle left to give.`,
				},
				{
					title: "The Last Light",
					content: `Six months, four near-death experiences, and one very grumpy dragon later, they stood at the heart of the final Wellspring.

It was beautiful—a column of pure light stretching from the earth to the heavens, pulsing with every color imaginable and some that shouldn't exist. But even as they watched, the light flickered, dimmed, and nearly went out.

"We're too late," Marcus whispered, his voice hollow with despair.

"No." Elara stepped forward, her own power humming beneath her skin. In their journey, she had grown from a frightened girl into something more—not quite an Enchanter in the old sense, but something new. Something the world had never seen before. "You taught me that magic is about connection. About asking, not forcing."

She placed her hands against the fading light and closed her eyes.

"Hello," she said softly. "I know you're tired. I know you've been burning for thousands of years, giving everything you have to a world that forgot to be grateful. But I'm grateful. And I'm asking—please—for one more chance."

For a long moment, nothing happened.

Then the light blazed brighter than the sun, brighter than anything Marcus had ever seen. He shielded his eyes, felt tears streaming down his weathered cheeks, and laughed—a sound of pure, unrestrained joy.

When his vision cleared, the Wellspring stood renewed, and Elara was glowing with the same impossible light.

"What did you do?" he asked.

She smiled. "I made a connection. Isn't that what you taught me?"

Magic wasn't dying anymore. It was being reborn.

And this was just the beginning.`,
				},
			],
		},
		{
			title: "Midnight in Seoul",
			description:
				"A chance encounter at a 24-hour convenience store changes everything for two lonely souls navigating life in the city. He's a songwriter who can't write anymore; she's a translator haunted by words that aren't her own. Together, they discover that sometimes the best stories are the ones we write together.",
			status: NovelStatus.ONGOING,
			coverImageUrl: "https://picsum.photos/seed/seoul/400/600",
			tags: ["Romance", "Drama", "Slice of Life"],
			chapters: [
				{
					title: "3 AM",
					content: `The fluorescent lights of the GS25 buzzed overhead, casting everything in that particular shade of harsh that made Min-jun feel like a specimen under examination. He'd been staring at the ramen selection for ten minutes now, not because he was indecisive, but because going back to his empty apartment meant facing the blank page again.

Shin Ramyun. Jin Ramyun. Neoguri.

Nothing felt right. Nothing had felt right for eight months—not since his last hit song, not since the label started making pointed comments about productivity, not since he'd forgotten how to find music in the everyday noise of living.

"You're blocking the Chapagetti."

Min-jun startled. The voice belonged to a woman about his age, wrapped in an oversized cardigan that looked like it had been through several wars and emerged victorious. Her eyes were red-rimmed behind round glasses, and she clutched a can of coffee like a lifeline.

"Sorry," he mumbled, stepping aside.

She reached past him, grabbed two packages of Chapagetti, then paused. "You look like you're having a conversation with the noodles."

"What?"

"You've been mumbling at them for the past five minutes. I've been watching from the magazine section." She shrugged. "Slow night."

Min-jun found himself laughing—the first genuine laugh in weeks. "They weren't answering back, if that helps."

"It doesn't, but I appreciate the clarification." She headed toward the register, then stopped. "I'm about to eat these in the park across the street because my apartment is too quiet. You're welcome to join me and your noodle friends."

He should have said no. He had a deadline. He had responsibilities. He had a carefully constructed wall between himself and the rest of humanity.

"I'll grab the chopsticks," he said.`,
				},
				{
					title: "Lost in Translation",
					content: `Her name was Seo-yeon, and she translated books for a living.

"Not the exciting kind," she explained, slurping Chapagetti on a park bench at 3:30 AM. "Technical manuals, mostly. 'How to assemble your IKEA furniture in forty-seven languages.'"

"That sounds..."

"Soul-crushing? Yes." She pushed her glasses up. "But it pays rent, and occasionally I get a good novel. Last month I translated a Swedish thriller about a detective with a fear of fish. Very riveting."

Min-jun laughed again. It was becoming a concerning habit. "What would you translate if you could choose anything?"

The question made her pause, noodles dangling from her chopsticks. "Poetry," she said finally. "But poetry doesn't pay. And honestly, I'm not sure I'm brave enough. Translating poetry is like—like trying to catch a butterfly and put it in a jar without crushing its wings. The meaning is so fragile."

"I write songs," Min-jun heard himself say. "Or I used to. I haven't been able to write anything in eight months."

"Writer's block?"

"More like writer's void. Like there's a space where the music used to live, and now it's just... empty."

Seo-yeon nodded slowly. "I know that feeling. Sometimes I translate perfectly fine sentences and they feel hollow. Like the words are there, but the soul got lost in transit."

They sat in comfortable silence after that, two strangers united by the strange alchemy of late-night honesty.

When the sun started to rise, painting the sky in shades of orange and pink, Min-jun realized something terrifying: he didn't want to go home.

"Same time tomorrow?" he asked.

Seo-yeon smiled. "I'll bring better noodles."`,
				},
			],
		},
		{
			title: "Cultivation: Rise of the Fallen Master",
			description:
				"Once the greatest cultivator of his generation, Lin Feng fell from grace when his core was shattered by betrayal. Reborn in the body of a crippled young man, he must climb back to the peak of martial arts—this time, nothing will stand in his way. With memories of his past life and knowledge of techniques lost to time, he will forge a new path to immortality.",
			status: NovelStatus.ONGOING,
			coverImageUrl: "https://picsum.photos/seed/cultivation/400/600",
			tags: ["Fantasy", "Martial Arts", "Action", "Reincarnation", "System"],
			chapters: [
				{
					title: "Shattered",
					content: `The moment the Heavenly Sword pierced Lin Feng's cultivation core, the world became silence.

Not the peaceful kind—not the meditation chambers of the Azure Cloud Sect where he had spent ten thousand years ascending toward immortality. This was the silence of ending, of stars winking out one by one, of a universe folding in on itself.

"Did you really think," his senior brother's voice echoed through the void, "that the sect would let a commoner reach the Divine Realm?"

Lin Feng tried to respond, but his body was no longer his own. He felt himself falling—through clouds, through mountains, through the very fabric of reality.

And then, with a gasp that burned like swallowing fire, he woke.

The ceiling above him was wooden, cracked, and definitely not the marble halls of the Azure Cloud Sect. His body felt wrong—weaker than a mortal child, muscles atrophied, meridians blocked with decades of stagnation.

"Young Master Lin!" A servant's face appeared in his vision, aged and worried. "You've been unconscious for three days! The physician said you would never—"

"Where am I?" Lin Feng's voice came out as a rasp. This body's memories were surfacing slowly, like oil rising through water. Lin family. Crippled from birth. Seventeen years old. The disappointment of a once-great cultivation clan.

He was in a different body. A different life. But his memories—ten thousand years of cultivation techniques, pill formulas, secret arts—remained intact.

A smile crept across Lin Feng's unfamiliar face.

Last time, he had played by their rules. This time would be different.`,
				},
				{
					title: "The Broken Core",
					content: `The physician had declared it impossible. The elders had written him off. Even his own father had stopped visiting years ago, too ashamed to acknowledge the crippled son who couldn't cultivate a single wisp of qi.

Lin Feng understood now why this body had been abandoned. The meridians weren't just blocked—they were twisted, malformed, like rivers trying to flow uphill. Any attempt to cultivate normally would result in qi deviation and certain death.

Any normal attempt.

But Lin Feng was not normal. He had reached the ninth level of the Divine Realm in his past life. He had memorized the Primordial Scripture that predated the current cultivation system. He knew secrets that even immortals had forgotten.

Sitting in the lotus position on his threadbare bed, he closed his eyes and examined his broken meridians with his spiritual sense. Yes, they were damaged—but damage could be worked with. The question was whether this body could survive the process.

"Inverse Stellar Circulation," he murmured. "Never thought I'd use this technique again."

It had been created by a madman three hundred thousand years ago, designed specifically for those whose meridians defied natural cultivation. The madman had died during the process, of course. So had his next forty-seven disciples.

The forty-eighth had become a god.

Lin Feng smiled and began to circulate his qi in reverse.

The pain was immediate and absolute. But pain, he had learned long ago, was merely the body's way of saying it was still alive.

By dawn, his first meridian had untwisted itself. The journey of ten thousand miles had begun with a single step.`,
				},
			],
		},
	];

	// Create novels with chapters and tags
	for (const novelData of novelsData) {
		const novel = await prisma.novel.upsert({
			where: { slug: slugify(novelData.title) },
			update: {},
			create: {
				title: novelData.title,
				slug: slugify(novelData.title),
				description: novelData.description,
				coverImageUrl: novelData.coverImageUrl,
				status: novelData.status,
				isVisible: true,
				views: Math.floor(Math.random() * 10000),
				authorId: author.id,
			},
		});

		// Create chapters
		for (let i = 0; i < novelData.chapters.length; i++) {
			const chapterData = novelData.chapters[i];
			await prisma.chapter.upsert({
				where: {
					novelId_chapterNumber: {
						novelId: novel.id,
						chapterNumber: i + 1,
					},
				},
				update: {},
				create: {
					title: chapterData.title,
					content: chapterData.content,
					chapterNumber: i + 1,
					isPublished: true,
					views: Math.floor(Math.random() * 5000),
					novelId: novel.id,
				},
			});
		}

		// Connect tags
		for (const tagName of novelData.tags) {
			const tag = tags.find((t) => t.name === tagName);
			if (tag) {
				await prisma.novelTag.upsert({
					where: {
						novelId_tagId: {
							novelId: novel.id,
							tagId: tag.id,
						},
					},
					update: {},
					create: {
						novelId: novel.id,
						tagId: tag.id,
					},
				});
			}
		}

		console.log(
			`✅ Created novel: ${novel.title} with ${novelData.chapters.length} chapters`
		);
	}

	console.log("🎉 Seeding complete!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
