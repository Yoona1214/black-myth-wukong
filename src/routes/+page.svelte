<script lang="ts">
	import type { Action } from 'svelte/action';

	const SEGMENTS = 5;
  const SEGMENT_DURATION = 2;
  const FPS = 30;
  const FRAME_TIME = 1 / FPS;

	let index = 0;
	let videoEl: HTMLVideoElement | null = null;
	let frameTimer: number;
  let playing = $state(false);

	const onVideoReady: Action<HTMLVideoElement> = (video) => {
		videoEl = video;
	};

	function play(segment: number, reverse = false) {
		console.log('🚀 ~ play ~ segment:', segment);
		if (!videoEl) return;
    playing = true;
		const startTime = (reverse ? (segment - 1 + SEGMENTS) % SEGMENTS : segment) * SEGMENT_DURATION;
		const endTime = startTime + SEGMENT_DURATION;

		// 清除之前可能存在的定时器
		if (frameTimer) {
			cancelAnimationFrame(frameTimer);
		}

		if (reverse) {
			videoEl.pause();
			let currentTime = endTime;

			const reversePlay = () => {
				if (!videoEl) return;
				currentTime = Math.max(startTime, currentTime - FRAME_TIME);
				videoEl.currentTime = currentTime;
			};

			videoEl.currentTime = currentTime;
			videoEl.addEventListener('seeked', function onSeeked() {
				if (currentTime > startTime) {
					frameTimer = requestAnimationFrame(reversePlay);
				} else {
					playing = false;
					videoEl?.removeEventListener('seeked', onSeeked);
				}
			});
		} else {
			videoEl.currentTime = startTime;
			videoEl.play();
			const pauseHandler = () => {
				if (!videoEl) return;
				if (videoEl.currentTime >= endTime) {
					videoEl.pause();
					playing = false;
					videoEl.removeEventListener('timeupdate', pauseHandler);
				}
			};
			videoEl.addEventListener('timeupdate', pauseHandler);
		}
	}

	function prev() {
		play(index, true);
    index = (index - 1 + SEGMENTS) % SEGMENTS;
	}

	function next() {
		play(index);
    index = (index + 1) % SEGMENTS;
	}
</script>

<div class="fixed left-0 top-0 flex h-full w-full bg-black px-20">
	<video
		id="wukong-transformation-video"
		class="h-full w-full object-scale-down object-center"
    controls
		use:onVideoReady
	>
		<source src="/wukong-transformation.mp4" type="video/mp4" />
		<track kind="captions" />
	</video>
</div>
<div class="fixed left-0 top-0 flex flex h-full w-full items-center justify-between px-20">
	<button
		aria-label="Previous"
		class="flex size-20 shrink-0 items-center justify-center rounded-full bg-white/50"
		onclick={prev}
    disabled={playing}
	>
		<span class="iconify lucide--arrow-left text-2xl text-white"></span>
	</button>
	<button
		aria-label="Next"
		class="flex size-20 shrink-0 items-center justify-center rounded-full bg-white/50"
		onclick={next}
    disabled={playing}
	>
		<span class="iconify lucide--arrow-right text-2xl text-white"></span>
	</button>
</div>
