import React, { useEffect, useState } from 'react';
import './App.css';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: string;
	address: {
		city: string;
	};
	isOldest?: boolean;
}

const App: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]); // initial state for users
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // initial state for filtered users
	const [searchTerm, setSearchTerm] = useState(''); // initial state for search term
	const [selectedCity, setSelectedCity] = useState(''); // initial state for selected city
	const [highlightOldest, setHighlightOldest] = useState(false); // initial state for highlight oldest

	// fetching data from the API
	useEffect(() => {
		fetch('https://dummyjson.com/users')
			.then((res) => res.json())
			.then((data) => {
				setUsers(data.users);
				setFilteredUsers(data.users);
			});
	}, []);

	// handling search functionality
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value.toLowerCase());
	};

	const handleHighlightChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setHighlightOldest(event.target.checked);
	};

	// useEffect(() => {
	// 	let filtered = users.filter(
	// 		(user) =>
	// 			user.firstName.toLowerCase().includes(searchTerm) ||
	// 			user.lastName.toLowerCase().includes(searchTerm)
	// 	);

	// 	if (selectedCity) {
	// 		filtered = filtered.filter(
	// 			(user) => user.address.city === selectedCity
	// 		);
	// 	}

	// 	if (highlightOldest) {
	// 		const oldestUsers: User[] = [];
	// 		const cities = Array.from(
	// 			new Set(filtered.map((user) => user.address.city))
	// 		);

	// 		cities.forEach((city) => {
	// 			const usersInCity = filtered.filter(
	// 				(user) => user.address.city === city
	// 			);
	// 			const oldestUser = usersInCity.reduce((oldest, user) =>
	// 				new Date(user.birthDate) < new Date(oldest.birthDate)
	// 					? user
	// 					: oldest
	// 			);
	// 			oldestUsers.push(oldestUser);
	// 		});

	// 		filtered = oldestUsers;
	// 	}

	// 	setFilteredUsers(filtered);
	// }, [searchTerm, selectedCity, highlightOldest, users]);

	useEffect(() => {
		let filtered = users.filter(
			(user) =>
				user.firstName.toLowerCase().includes(searchTerm) ||
				user.lastName.toLowerCase().includes(searchTerm)
		);

		if (selectedCity) {
			filtered = filtered.filter(
				(user) => user.address.city === selectedCity
			);
		}

		// Highlight oldest users without filtering
		if (highlightOldest) {
			const oldestUsers: User[] = [];
			const cities = Array.from(
				new Set(filtered.map((user) => user.address.city))
			);

			cities.forEach((city) => {
				const usersInCity = filtered.filter(
					(user) => user.address.city === city
				);
				const oldestUser = usersInCity.reduce((oldest, user) =>
					new Date(user.birthDate) < new Date(oldest.birthDate)
						? user
						: oldest
				);
				oldestUsers.push(oldestUser);
			});

			// Mark users as highlighted if they are the oldest
			filtered = users.map((user) => ({
				...user,
				isOldest: oldestUsers.includes(user),
			}));
		}

		setFilteredUsers(filtered);
	}, [searchTerm, selectedCity, highlightOldest, users]);

	const cities = Array.from(new Set(users.map((user) => user.address.city)));

	return (
		<div className="container">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
				Digital Product School
			</h1>
			<div className="py-10 flex flex-row gap-10 justify-items-center content-center items-center">
				<Input
					type="text"
					placeholder="Search by name"
					value={searchTerm}
					onChange={handleSearch}
					className="bg-white py-6 w-[360px]"
				/>

				<Select onValueChange={setSelectedCity} value={selectedCity}>
					<SelectTrigger className="w-[180px] bg-white py-6">
						<SelectValue placeholder="Select a city" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Cities</SelectLabel>
							{cities.map((city) => (
								<SelectItem key={city} value={city}>
									{city}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<div className="flex items-center space-x-1">
					<Input
						type="checkbox"
						checked={highlightOldest}
						onChange={handleHighlightChange}
						className="w-[40px] bg-white h-[20px] border-none border-radius-5"
					/>
					<label
						htmlFor="terms"
						className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Highlight oldest per city
					</label>
				</div>
			</div>

			<Table className="bg-white table-container">
				<TableHeader>
					<TableRow>
						<TableHead className="px-4 py-4 font-bold text-black">
							Name
						</TableHead>
						<TableHead className="px-4 py-4 font-bold text-black">
							City
						</TableHead>
						<TableHead className="px-4 py-4 font-bold text-black">
							Birthday
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredUsers.map((user) => (
						<TableRow
							key={user.id}
							className={
								highlightOldest && user.isOldest
									? 'highlight-table-row cursor-pointer'
									: 'cursor-pointer'
							}
						>
							<TableCell className="font-medium px-4 py-4 ">
								{`${user.firstName} ${user.lastName}`}
							</TableCell>
							<TableCell>{user.address.city}</TableCell>
							<TableCell>
								{new Date(user.birthDate).toLocaleDateString()}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default App;
