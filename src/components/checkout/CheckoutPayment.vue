<template>
    <form id="payment-form" @submit.prevent="handleSubmit" v-if="!success && error === false">
		<div id="payment-element"></div>
		<button id="submit" :disabled="isLoading">
			<span id="button-text" class="button-native" :class="{ hidden: isLoading }">Pay now {{ amount_to_pay }}$</span>
		</button>
	
		<div id="payment-message" :class="{ hidden: !message }">
			{{ message }}
		</div>
    </form>
    <CompletePayment :data="props.data" v-if="success"/>
    <ErrorPayment :message="message" v-if="error"/>
</template>
  
<script setup>
	import { ref, onMounted, defineEmits  } from 'vue'
	import { useAuthStore } from '@/stores/authStore'
	import CompletePayment from '@/components/checkout/CompletePayment.vue'
	import ErrorPayment from './ErrorPayment.vue'
	import axios from 'axios'
	const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
	const props = defineProps({
		data: {
			type: Object,
			required: true
		},
		table: {
			type: Object,
			required: true
		},
		event: {
			type: Object,
			required: true
		},
		ticket: {
			type: Boolean,
			default: false
		},
		counters: {
			type: Array,
		},
	});
	const emit = defineEmits(['updateReservation'])

	const items = [{ 
		name: props.data.name,
		amount: props.data.price 
	}];
	const message = ref('');
	const error = ref(false);
	const amount_to_pay =ref(0);
	const success = ref(false);
	const elements = ref(null)
	const isLoading = ref(false)
	const authStore = useAuthStore();
	onMounted(async () => {
		await initialize()
	});


	async function checkTicketAndTableAvailability() {
		try {
			const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/availability', {
				table_id: props.table ? props.table.id : '',
				event_id: props.event.id,
			}, {
				headers: {
					"Accept": "application/json",
					"Authorization": `Bearer ${authStore.token}`,
				}
			});
			return response.data;
		} catch (error) {
			console.error('Error checking availability:', error);
		}
	}

	async function storeTableData(tableObj) {
		try {
			await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/storeData',
				{
					table: true,
					price: tableObj?.deposit + '00',
					name: 'Table reservation for ' + props.event.name,
					type: 'reservation',
					male: props.counters[0],
					female: props.counters[1],
					restaurant_id: props.event.restaurant_id,
					user_id: authStore.user?.id,
					event_id: props.event.id,
					table_id: tableObj.id,
				},
				{
					headers: {
						"Accept": "application/json",
						"Authorization": `Bearer ${authStore.token}`,
					}
				});
		} catch (error) {
			console.error('Error fetching client secret:', error);
			authStore.logout();
		}
	}

	async function storeTicketData () {
		try {
			let ticketObj = {};
			if (authStore?.user?.gender === 'male' || authStore?.user?.gender === null) {
				ticketObj = {
					price: props.event.price_per_ticket + '00',
					name: 'Ticket for ' + props.event.name, 
					event_id: props.event.id,
					male: 1,
					female: 0,
					restaurant_id: props.event.restaurant_id,
					user_id: authStore.user?.id,
				};
			} else if (authStore?.user?.gender === 'female') {
				ticketObj = {
					price: props.event.price_per_ticket + '00',
					name: 'Ticket for ' + props.event.name,
					male: 0,
					female: 1,
					event_id: props.event.id,
					restaurant_id: props.event.restaurant_id,
					user_id: authStore.user?.id,
				};
			}
			await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/storeData',
			ticketObj,
			{
				headers: {
					"Accept": "application/json",
					"Authorization": `Bearer ${authStore.token}`,
				}
			});

		} catch (error) {
			console.error('Error fetching client secret:', error);
			authStore.logout();
		}
	}
	
	async function initialize() {
		const response = await fetch(import.meta.env.VITE_APP_ENDPOINT+'create-payment-intent', {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${authStore.token}`,

		},
			body: JSON.stringify({ items }),
		})
	
		const { clientSecret, amount } = await response.json()
		elements.value = stripe.elements({ clientSecret })
		amount_to_pay.value = amount;
		const paymentElement = elements.value.create('payment', {
			layout: 'accordion',
		})
	
		paymentElement.mount('#payment-element')
	}
	
	async function handleSubmit() {
		isLoading.value = true;
		message.value = '';
		const result = await checkTicketAndTableAvailability();
		const ticket_available = result.ticket_left; //if ticket left pay continue
		const table_reserved = result.table_reserved; //if reserved do not pay return 

		if (table_reserved) {
			error.value = true; // Ensure `error` is initialized before this line
			emit('updateReservation', error.value)
			return;
		}

		if (!ticket_available) {
			error.value = true; // Ensure `error` is initialized before this line
			message.value = 'Payment failed!. \nNo tickets available for this event. \nPlease try another event.';
			success.value = false;
			return;
		}

		const { paymentIntent, error: stripeError } = await stripe.confirmPayment({
			elements: elements.value,
			confirmParams: {},
			redirect: 'if_required',
		});

		if (stripeError) {
			if (stripeError.type === 'card_error' || stripeError.type === 'validation_error') {
				showMessage(stripeError.message);
			} else {
				showMessage('An unexpected error occurred.');
			}
		} else if (paymentIntent) {
			switch (paymentIntent.status) {
				case 'succeeded':
					showMessage('Payment succeeded!');
					success.value = true;

					if (props.ticket) {
						await storeTicketData();
					} else {
						await storeTableData(props.table);
					}
					break;
				case 'processing':
					showMessage('Your payment is processing.');
					break;
				case 'requires_payment_method':
					showMessage('Payment failed, please try another payment method.');
					break;
				default:
					showMessage('Payment status: ' + paymentIntent.status);
			}
		}

		isLoading.value = false;
	}

	
	function showMessage(msg) {
		message.value = msg
		setTimeout(() => {
		message.value = ''
		}, 4000)
	}

</script>
  
<style scoped>
form {
	padding: unset !important;
	align-self: center;
	box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
		0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
	border-radius: 7px;
	padding: 40px;
	margin-top: auto;
	margin-bottom: auto;
}

#payment-message {
	color: rgb(105, 115, 134);
	font-size: 16px;
	line-height: 20px;
	padding-top: 12px;
	text-align: center;
}

#payment-element {
	margin-bottom: 24px;
}

button {
	background: #0055DE;
	font-family: Arial, sans-serif;
	color: #ffffff;
	border-radius: 4px;
	border: 0;
	padding: 12px 16px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	display: block;
	transition: all 0.2s ease;
	box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
	width: 100%;
}

button:hover {
	filter: contrast(115%);
}

button:disabled {
	opacity: 0.5;
	cursor: default;
}

.spinner,
.spinner:before,
.spinner:after {
	border-radius: 50%;
}

.spinner {
	color: #ffffff;
	font-size: 22px;
	text-indent: -99999px;
	margin: 0px auto;
	position: relative;
	width: 20px;
	height: 20px;
	box-shadow: inset 0 0 0 2px;
	-webkit-transform: translateZ(0);
	-ms-transform: translateZ(0);
	transform: translateZ(0);
}

button {
    background: #A23B3B !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    clear: both !important;
    contain: content !important;
}

.spinner:before,
.spinner:after {
	position: absolute;
	content: "";
}

.spinner:before {
	width: 10.4px;
	height: 20.4px;
	background: #0055DE;
	border-radius: 20.4px 0 0 20.4px;
	top: -0.2px;
	left: -0.2px;
	-webkit-transform-origin: 10.4px 10.2px;
	transform-origin: 10.4px 10.2px;
	-webkit-animation: loading 2s infinite ease 1.5s;
	animation: loading 2s infinite ease 1.5s;
}

.spinner:after {
	width: 10.4px;
	height: 10.2px;
	background: #0055DE;
	border-radius: 0 10.2px 10.2px 0;
	top: -0.1px;
	left: 10.2px;
	-webkit-transform-origin: 0px 10.2px;
	transform-origin: 0px 10.2px;
	-webkit-animation: loading 2s infinite ease;
	animation: loading 2s infinite ease;
}

#payment-status {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	row-gap: 30px;
	min-width: 500px;
	min-height: 380px;
	align-self: center;
	box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
		0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
	border-radius: 7px;
	padding: 40px;
	opacity: 0;
	animation: fadeInAnimation 1s ease forwards;
}

#status-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 40px;
	width: 40px;
	border-radius: 50%;
}

h2 {
	margin: 0;
	color: #30313D;
	text-align: center;
}

a {
	text-decoration: none;
	font-size: 16px;
	font-weight: 600;
	font-family: Arial, sans-serif;
	display: block;
}

a:hover {
	filter: contrast(120%);
}

#details-table {
	overflow-x: auto;
	width: 100%;
}

table {
	width: 100%;
	font-size: 14px;
	border-collapse: collapse;
}

table tbody tr:first-child td {
	border-top: 1px solid #E6E6E6; /* Top border */
	padding-top: 10px;
}

table tbody tr:last-child td {
	border-bottom: 1px solid #E6E6E6; /* Bottom border */
}

td {
	padding-bottom: 10px;
}

.TableContent {
	text-align: right;
	color: #6D6E78;
}

.TableLabel {
	font-weight: 600;
	color: #30313D;
}

#view-details {
	color: #0055DE;
}

#retry-button {
	text-align: center;
	background: #0055DE;
	color: #ffffff;
	border-radius: 4px;
	border: 0;
	padding: 12px 16px;
	transition: all 0.2s ease;
	box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
	width: 100%;
}

@-webkit-keyframes loading {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@keyframes loading {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@keyframes fadeInAnimation {
	to {
		opacity: 1;
	}
}

@media only screen and (max-width: 600px) {
	form, #payment-status{
		width: 80vw;
		min-width: initial;
	}
}

.hidden {
	display: none;
}

.spinner {
	width: 20px;
	height: 20px;
	border: 3px solid #ccc;
	border-top-color: #333;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	display: inline-block;
	margin-right: 8px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>