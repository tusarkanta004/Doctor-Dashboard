import { Counter } from "@/models/Doctor";

export const initializeCounters = async () => {
  const existingCounter = await Counter.findById('doctorId');
  if (!existingCounter) {
    await Counter.create({ _id: 'doctorId', seq: 0 });
    console.log('Doctor counter initialized.');
  } else {
    console.log('Doctor counter already exists.');
  }
};